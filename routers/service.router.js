import { Router } from "express";
import {
  createServiceController,
  updateServiceController,
  deleteServiceController,
  getServiceController,
  listServicesController,
  getAllActiveServicesController,
} from "../controllers/service.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const serviceRouter = Router();

serviceRouter.get("/health", (_, res) => {
  res.json({ success: true, message: "Service module working" });
});

serviceRouter.use(authenticate);

serviceRouter.post("/active", getAllActiveServicesController);
serviceRouter.get("/:id", getServiceController);
serviceRouter.post("/", listServicesController);
serviceRouter.post("/create", createServiceController);
serviceRouter.patch("/:id", updateServiceController);
serviceRouter.delete("/:id", deleteServiceController);

export default serviceRouter;
