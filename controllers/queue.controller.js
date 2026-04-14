import * as queueService from "../services/queue.service.js";
import {
  joinQueueDto,
  createCounterDto,
  updateCounterStatusDto,
  createAppointmentDto,
  updateAppointmentStatusDto,
} from "../dtos/queue.dto.js";

// --- Queue Tickets ---

export const joinQueueController = async (req, res, next) => {
  try {
    const payload = await joinQueueDto.validate(req.body);
    const result = await queueService.joinQueue(payload, req.user);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getQueueStatusController = async (req, res, next) => {
  try {
    const result = await queueService.getQueueStatus(
      req.params.serviceId,
      req.user.instituteId,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const callNextTicketController = async (req, res, next) => {
  try {
    const result = await queueService.callNextTicket(
      req.params.counterId,
      req.user,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const cancelTicketController = async (req, res, next) => {
  try {
    const result = await queueService.cancelTicket(req.params.id, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getUserTicketsController = async (req, res, next) => {
  try {
    const result = await queueService.getUserTickets(req.user);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// --- Counters ---

export const createCounterController = async (req, res, next) => {
  try {
    const payload = await createCounterDto.validate(req.body);
    const result = await queueService.createCounter(payload, req.user);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const updateCounterStatusController = async (req, res, next) => {
  try {
    const payload = await updateCounterStatusDto.validate(req.body);
    const result = await queueService.updateCounterStatus(
      req.params.id,
      payload.status,
      req.user,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const listCountersController = async (req, res, next) => {
  try {
    const result = await queueService.listCounters(req.query, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// --- Appointments ---

export const createAppointmentController = async (req, res, next) => {
  try {
    const payload = await createAppointmentDto.validate(req.body);
    const result = await queueService.createAppointment(payload, req.user);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const listAppointmentsController = async (req, res, next) => {
  try {
    const result = await queueService.listAppointments(req.query, req.user);
    res.status(200).json({
      success: true,
      data: result.items,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAppointmentStatusController = async (req, res, next) => {
  try {
    const payload = await updateAppointmentStatusDto.validate(req.body);
    const result = await queueService.updateAppointmentStatus(
      req.params.id,
      payload.status,
      req.user,
      payload.remarks,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const cancelAppointmentController = async (req, res, next) => {
  try {
    const result = await queueService.cancelAppointment(
      req.params.id,
      req.user,
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
