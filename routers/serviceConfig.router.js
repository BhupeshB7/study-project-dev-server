import { Router } from "express";
import {
  createServiceConfigController,
  updateServiceConfigController,
  getServiceConfigController,
  deleteServiceConfigController,
  listServiceConfigsController,
} from "../controllers/serviceConfig.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import { UserRole } from "../enum/user.enum.js";

const serviceConfigRouter = Router();

serviceConfigRouter.get("/health", (_, res) => {
  res.json({ success: true, message: "Service config module working" });
});

serviceConfigRouter.use(authenticate);

serviceConfigRouter.post(
  "/",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  createServiceConfigController,
);

serviceConfigRouter.get(
  "/",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  listServiceConfigsController,
);

serviceConfigRouter.get("/:serviceId", getServiceConfigController);

serviceConfigRouter.patch(
  "/:serviceId",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  updateServiceConfigController,
);

serviceConfigRouter.delete(
  "/:serviceId",
  authorizeRoles(UserRole.ADMIN),
  deleteServiceConfigController,
);

export default serviceConfigRouter;
