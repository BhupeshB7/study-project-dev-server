import * as exportService from "../services/export.service.js";

export const exportServiceRequestsController = async (req, res, next) => {
  try {
    const csv = await exportService.exportServiceRequests(req.query, req.user);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=service-requests.csv",
    );
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};

export const exportQueueDataController = async (req, res, next) => {
  try {
    const csv = await exportService.exportQueueData(req.query, req.user);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=queue-data.csv",
    );
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};

export const exportAppointmentsController = async (req, res, next) => {
  try {
    const csv = await exportService.exportAppointments(req.query, req.user);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=appointments.csv",
    );
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};

export const exportUsersController = async (req, res, next) => {
  try {
    const csv = await exportService.exportUsers(req.query, req.user);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=users.csv");
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};
