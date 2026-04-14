import { EXPORT_PERMISSIONS } from "../constants/permission.js";
import { ServiceRequestModel } from "../models/serviceRequest.model.js";
import { QueueTicketModel } from "../models/queueTicket.model.js";
import { AppointmentModel } from "../models/appointment.model.js";
import { UserModel } from "../models/user.model.js";
import { canUser } from "../utils/rbac.util.js";
import logger from "../utils/logger.js";

const exportLogger = logger.namespaceLogger("EXPORT");

const toCsv = (columns, rows) => {
  const header = columns.join(",");
  const body = rows.map((row) =>
    columns
      .map((col) => {
        const val = row[col] ?? "";
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(","),
  );
  return [header, ...body].join("\n");
};

export const exportServiceRequests = async (query, user) => {
  if (!canUser(user, EXPORT_PERMISSIONS.EXPORT_CSV)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const filter = { instituteId: user.instituteId };
  if (query.status) filter.status = query.status;
  if (query.serviceId) filter.serviceId = query.serviceId;
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }

  const requests = await ServiceRequestModel.find(filter)
    .populate("serviceId", "name")
    .populate("applicantId", "fullName email")
    .populate("assignedTo", "fullName email")
    .sort({ createdAt: -1 })
    .lean();

  const rows = requests.map((r) => ({
    requestNumber: r.requestNumber,
    service: r.serviceId?.name || "",
    applicant: r.applicantId?.fullName || "",
    applicantEmail: r.applicantId?.email || "",
    assignedTo: r.assignedTo?.fullName || "",
    status: r.status,
    priority: r.priority,
    description: r.description || "",
    createdAt: r.createdAt?.toISOString() || "",
    resolvedAt: r.resolvedAt?.toISOString() || "",
  }));

  const columns = [
    "requestNumber",
    "service",
    "applicant",
    "applicantEmail",
    "assignedTo",
    "status",
    "priority",
    "description",
    "createdAt",
    "resolvedAt",
  ];

  exportLogger.info(`Exported ${rows.length} service requests`);
  return toCsv(columns, rows);
};

export const exportQueueData = async (query, user) => {
  if (!canUser(user, EXPORT_PERMISSIONS.EXPORT_CSV)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const filter = { instituteId: user.instituteId };
  if (query.serviceId) filter.serviceId = query.serviceId;
  if (query.status) filter.status = query.status;
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }

  const tickets = await QueueTicketModel.find(filter)
    .populate("serviceId", "name")
    .populate("userId", "fullName email")
    .sort({ createdAt: -1 })
    .lean();

  const rows = tickets.map((t) => ({
    ticketNumber: t.ticketNumber,
    service: t.serviceId?.name || "",
    user: t.userId?.fullName || "",
    userEmail: t.userId?.email || "",
    status: t.status,
    position: t.position,
    createdAt: t.createdAt?.toISOString() || "",
    calledAt: t.calledAt?.toISOString() || "",
    completedAt: t.completedAt?.toISOString() || "",
  }));

  const columns = [
    "ticketNumber",
    "service",
    "user",
    "userEmail",
    "status",
    "position",
    "createdAt",
    "calledAt",
    "completedAt",
  ];

  exportLogger.info(`Exported ${rows.length} queue tickets`);
  return toCsv(columns, rows);
};

export const exportAppointments = async (query, user) => {
  if (!canUser(user, EXPORT_PERMISSIONS.EXPORT_CSV)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const filter = { instituteId: user.instituteId };
  if (query.serviceId) filter.serviceId = query.serviceId;
  if (query.status) filter.status = query.status;
  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = new Date(query.from);
    if (query.to) filter.date.$lte = new Date(query.to);
  }

  const appointments = await AppointmentModel.find(filter)
    .populate("serviceId", "name")
    .populate("userId", "fullName email")
    .populate("staffId", "fullName email")
    .sort({ date: 1 })
    .lean();

  const rows = appointments.map((a) => ({
    service: a.serviceId?.name || "",
    user: a.userId?.fullName || "",
    userEmail: a.userId?.email || "",
    staff: a.staffId?.fullName || "",
    date: a.date?.toISOString()?.split("T")[0] || "",
    timeStart: a.timeSlot?.start || "",
    timeEnd: a.timeSlot?.end || "",
    status: a.status,
    purpose: a.purpose || "",
    remarks: a.remarks || "",
  }));

  const columns = [
    "service",
    "user",
    "userEmail",
    "staff",
    "date",
    "timeStart",
    "timeEnd",
    "status",
    "purpose",
    "remarks",
  ];

  exportLogger.info(`Exported ${rows.length} appointments`);
  return toCsv(columns, rows);
};

export const exportUsers = async (query, user) => {
  if (!canUser(user, EXPORT_PERMISSIONS.EXPORT_CSV)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  const filter = { instituteId: user.instituteId };
  if (query.role) filter.role = query.role;
  if (query.status) filter.status = query.status;

  const users = await UserModel.find(filter)
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();

  const rows = users.map((u) => ({
    fullName: u.fullName,
    email: u.email,
    mobile: u.mobile,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt?.toISOString() || "",
  }));

  const columns = ["fullName", "email", "mobile", "role", "status", "createdAt"];

  exportLogger.info(`Exported ${rows.length} users`);
  return toCsv(columns, rows);
};
