import mongoose from "mongoose";
import redisClient from "../config/redis.js";
import { QueueTicketStatus, CounterStatus, AppointmentStatus } from "../enum/queue.enum.js";
import { QUEUE_PERMISSIONS } from "../constants/permission.js";
import { QueueTicketModel } from "../models/queueTicket.model.js";
import { QueueCounterModel } from "../models/queueCounter.model.js";
import { AppointmentModel } from "../models/appointment.model.js";
import { canUser } from "../utils/rbac.util.js";
import { createNotification } from "./notification.service.js";
import { NotificationCategory } from "../enum/notification.enum.js";
import logger from "../utils/logger.js";

const qLogger = logger.namespaceLogger("QUEUE");

const AVG_SERVICE_MINUTES = 10;

// --- Queue Ticket ---

export const joinQueue = async (payload, user) => {
  if (!canUser(user, QUEUE_PERMISSIONS.QUEUE_JOIN)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  // Check if user already has an active ticket for this service
  const existing = await QueueTicketModel.findOne({
    userId: user._id,
    serviceId: payload.serviceId,
    status: { $in: [QueueTicketStatus.WAITING, QueueTicketStatus.SERVING] },
  });

  if (existing) {
    throw Object.assign(
      new Error("You already have an active ticket for this service"),
      { statusCode: 400 },
    );
  }

  // Calculate position
  const waitingCount = await QueueTicketModel.countDocuments({
    serviceId: payload.serviceId,
    instituteId: user.instituteId,
    status: QueueTicketStatus.WAITING,
  });

  const ticket = await QueueTicketModel.create({
    serviceId: payload.serviceId,
    instituteId: user.instituteId,
    userId: user._id,
    position: waitingCount + 1,
    estimatedWaitMinutes: (waitingCount + 1) * AVG_SERVICE_MINUTES,
  });

  qLogger.info(`Queue ticket issued: ${ticket.ticketNumber}`);

  // Broadcast queue update via Redis pub/sub
  await redisClient.publish(
    `queue:${payload.serviceId}`,
    JSON.stringify({ type: "TICKET_ISSUED", ticket }),
  );

  return ticket;
};

export const getQueueStatus = async (serviceId, instituteId) => {
  const [waiting, serving, counters] = await Promise.all([
    QueueTicketModel.find({
      serviceId,
      instituteId,
      status: QueueTicketStatus.WAITING,
    })
      .sort({ position: 1 })
      .populate("userId", "fullName"),
    QueueTicketModel.find({
      serviceId,
      instituteId,
      status: QueueTicketStatus.SERVING,
    }).populate("userId", "fullName"),
    QueueCounterModel.find({ serviceId, instituteId }).populate(
      "staffId",
      "fullName",
    ),
  ]);

  return {
    waitingCount: waiting.length,
    servingCount: serving.length,
    waitingTickets: waiting,
    servingTickets: serving,
    counters,
    estimatedWaitMinutes: waiting.length * AVG_SERVICE_MINUTES,
  };
};

export const callNextTicket = async (counterId, user) => {
  if (!canUser(user, QUEUE_PERMISSIONS.QUEUE_CALL_NEXT)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const counter = await QueueCounterModel.findById(counterId);
  if (!counter) {
    throw Object.assign(new Error("Counter not found"), { statusCode: 404 });
  }

  if (counter.status !== CounterStatus.OPEN) {
    throw Object.assign(new Error("Counter is not open"), { statusCode: 400 });
  }

  // Complete current ticket if any
  if (counter.currentTicketId) {
    await QueueTicketModel.findByIdAndUpdate(counter.currentTicketId, {
      status: QueueTicketStatus.COMPLETED,
      completedAt: new Date(),
    });
    counter.totalServed += 1;
  }

  // Get next waiting ticket
  const nextTicket = await QueueTicketModel.findOneAndUpdate(
    {
      serviceId: counter.serviceId,
      instituteId: counter.instituteId,
      status: QueueTicketStatus.WAITING,
    },
    {
      status: QueueTicketStatus.SERVING,
      counterId: counter._id,
      calledAt: new Date(),
      servedAt: new Date(),
    },
    { new: true, sort: { position: 1 } },
  );

  if (!nextTicket) {
    counter.currentTicketId = null;
    await counter.save();
    return { message: "No more tickets in queue", counter };
  }

  counter.currentTicketId = nextTicket._id;
  await counter.save();

  // Recalculate positions for remaining waiting tickets
  const remaining = await QueueTicketModel.find({
    serviceId: counter.serviceId,
    instituteId: counter.instituteId,
    status: QueueTicketStatus.WAITING,
  }).sort({ position: 1 });

  for (let i = 0; i < remaining.length; i++) {
    remaining[i].position = i + 1;
    remaining[i].estimatedWaitMinutes = (i + 1) * AVG_SERVICE_MINUTES;
    await remaining[i].save();
  }

  qLogger.info(`Next ticket called: ${nextTicket.ticketNumber} at ${counter.name}`);

  // Notify the user
  createNotification({
    userId: nextTicket.userId,
    title: "Your Turn!",
    message: `Ticket ${nextTicket.ticketNumber} - Please proceed to ${counter.name}`,
    category: NotificationCategory.QUEUE,
    referenceId: nextTicket._id,
    referenceModel: "QueueTicket",
  }).catch(() => {});

  // Broadcast
  await redisClient.publish(
    `queue:${counter.serviceId}`,
    JSON.stringify({ type: "TICKET_CALLED", ticket: nextTicket, counter }),
  );

  return { ticket: nextTicket, counter };
};

export const cancelTicket = async (ticketId, user) => {
  const ticket = await QueueTicketModel.findById(ticketId);
  if (!ticket) {
    throw Object.assign(new Error("Ticket not found"), { statusCode: 404 });
  }

  if (String(ticket.userId) !== String(user._id)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  if (ticket.status !== QueueTicketStatus.WAITING) {
    throw Object.assign(new Error("Can only cancel waiting tickets"), {
      statusCode: 400,
    });
  }

  ticket.status = QueueTicketStatus.CANCELLED;
  await ticket.save();

  qLogger.info(`Ticket cancelled: ${ticket.ticketNumber}`);
  return ticket;
};

export const getUserTickets = async (user) => {
  return QueueTicketModel.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("serviceId", "name")
    .populate("counterId", "name");
};

// --- Counter Management ---

export const createCounter = async (payload, user) => {
  if (!canUser(user, QUEUE_PERMISSIONS.COUNTER_MANAGE)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const counter = await QueueCounterModel.create({
    ...payload,
    instituteId: user.instituteId,
  });

  qLogger.info(`Counter created: ${counter.name}`);
  return counter;
};

export const updateCounterStatus = async (counterId, status, user) => {
  if (!canUser(user, QUEUE_PERMISSIONS.COUNTER_MANAGE)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const counter = await QueueCounterModel.findByIdAndUpdate(
    counterId,
    {
      status,
      staffId: status === CounterStatus.OPEN ? user._id : null,
    },
    { new: true },
  );

  if (!counter) {
    throw Object.assign(new Error("Counter not found"), { statusCode: 404 });
  }

  qLogger.info(`Counter ${counter.name} status: ${status}`);
  return counter;
};

export const listCounters = async (query, user) => {
  const filter = { instituteId: user.instituteId };
  if (query.serviceId) filter.serviceId = query.serviceId;
  if (query.status) filter.status = query.status;

  return QueueCounterModel.find(filter)
    .populate("staffId", "fullName email")
    .populate("serviceId", "name")
    .populate("currentTicketId", "ticketNumber");
};

// --- Appointments ---

export const createAppointment = async (payload, user) => {
  if (!canUser(user, QUEUE_PERMISSIONS.APPOINTMENT_CREATE)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  // Check for slot conflict
  const conflict = await AppointmentModel.findOne({
    serviceId: payload.serviceId,
    date: payload.date,
    "timeSlot.start": payload.timeSlot.start,
    status: { $nin: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW] },
  });

  if (conflict) {
    throw Object.assign(new Error("Time slot already booked"), {
      statusCode: 409,
    });
  }

  const appointment = await AppointmentModel.create({
    ...payload,
    instituteId: user.instituteId,
    userId: user._id,
  });

  qLogger.info(`Appointment created: ${appointment._id}`);

  createNotification({
    userId: user._id,
    title: "Appointment Scheduled",
    message: `Your appointment on ${payload.date} at ${payload.timeSlot.start} has been scheduled.`,
    category: NotificationCategory.APPOINTMENT,
    referenceId: appointment._id,
    referenceModel: "Appointment",
  }).catch(() => {});

  return appointment;
};

export const listAppointments = async (query, user) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = { instituteId: user.instituteId };

  if (user.role === "student") {
    filter.userId = user._id;
  }
  if (user.role === "staff") {
    filter.$or = [{ staffId: user._id }, { staffId: null }];
  }
  if (query.serviceId) filter.serviceId = query.serviceId;
  if (query.status) filter.status = query.status;
  if (query.date) filter.date = new Date(query.date);

  const [items, total] = await Promise.all([
    AppointmentModel.find(filter)
      .sort({ date: 1, "timeSlot.start": 1 })
      .skip(skip)
      .limit(limit)
      .populate("serviceId", "name")
      .populate("userId", "fullName email")
      .populate("staffId", "fullName email"),
    AppointmentModel.countDocuments(filter),
  ]);

  return {
    items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const updateAppointmentStatus = async (appointmentId, status, user, remarks) => {
  const appointment = await AppointmentModel.findById(appointmentId);
  if (!appointment) {
    throw Object.assign(new Error("Appointment not found"), {
      statusCode: 404,
    });
  }

  appointment.status = status;
  if (remarks) appointment.remarks = remarks;
  if (status === AppointmentStatus.COMPLETED) {
    appointment.completedAt = new Date();
  }

  await appointment.save();

  qLogger.info(`Appointment ${appointmentId} status: ${status}`);

  createNotification({
    userId: appointment.userId,
    title: "Appointment Updated",
    message: `Your appointment status changed to ${status}.`,
    category: NotificationCategory.APPOINTMENT,
    referenceId: appointment._id,
    referenceModel: "Appointment",
  }).catch(() => {});

  return appointment;
};

export const cancelAppointment = async (appointmentId, user) => {
  const appointment = await AppointmentModel.findById(appointmentId);
  if (!appointment) {
    throw Object.assign(new Error("Appointment not found"), {
      statusCode: 404,
    });
  }

  if (String(appointment.userId) !== String(user._id)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  if (
    ![AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED].includes(
      appointment.status,
    )
  ) {
    throw Object.assign(new Error("Cannot cancel appointment in current state"), {
      statusCode: 400,
    });
  }

  appointment.status = AppointmentStatus.CANCELLED;
  await appointment.save();

  qLogger.info(`Appointment cancelled: ${appointmentId}`);
  return appointment;
};
