import { Router } from "express";
import {
  exportServiceRequestsController,
  exportQueueDataController,
  exportAppointmentsController,
  exportUsersController,
} from "../controllers/export.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import { UserRole } from "../enum/user.enum.js";

const exportRouter = Router();

exportRouter.get("/health", (_, res) => {
  res.json({ success: true, message: "Export module working" });
});

exportRouter.use(authenticate);
exportRouter.use(authorizeRoles(UserRole.ADMIN, UserRole.STAFF));

exportRouter.get("/service-requests", exportServiceRequestsController);
exportRouter.get("/queue-data", exportQueueDataController);
exportRouter.get("/appointments", exportAppointmentsController);
exportRouter.get(
  "/users",
  authorizeRoles(UserRole.ADMIN),
  exportUsersController,
);

export default exportRouter;
