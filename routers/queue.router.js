import { Router } from "express";
import {
  joinQueueController,
  getQueueStatusController,
  callNextTicketController,
  cancelTicketController,
  getUserTicketsController,
  createCounterController,
  updateCounterStatusController,
  listCountersController,
  createAppointmentController,
  listAppointmentsController,
  updateAppointmentStatusController,
  cancelAppointmentController,
} from "../controllers/queue.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import { UserRole } from "../enum/user.enum.js";

const queueRouter = Router();

queueRouter.get("/health", (_, res) => {
  res.json({ success: true, message: "Queue module working" });
});

queueRouter.use(authenticate);

// --- Queue Tickets ---
queueRouter.post("/tickets", joinQueueController);
queueRouter.get("/tickets/my", getUserTicketsController);
queueRouter.patch("/tickets/:id/cancel", cancelTicketController);
queueRouter.get("/status/:serviceId", getQueueStatusController);
queueRouter.post(
  "/counters/:counterId/call-next",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  callNextTicketController,
);

// --- Counters ---
queueRouter.get("/counters", listCountersController);
queueRouter.post(
  "/counters",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  createCounterController,
);
queueRouter.patch(
  "/counters/:id/status",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  updateCounterStatusController,
);

// --- Appointments ---
queueRouter.post("/appointments", createAppointmentController);
queueRouter.get("/appointments", listAppointmentsController);
queueRouter.patch(
  "/appointments/:id/status",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  updateAppointmentStatusController,
);
queueRouter.patch("/appointments/:id/cancel", cancelAppointmentController);

export default queueRouter;
