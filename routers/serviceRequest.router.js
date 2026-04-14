import { Router } from "express";
import {
  submitServiceRequestController,
  getServiceRequestController,
  listServiceRequestsController,
  reviewServiceRequestController,
  cancelServiceRequestController,
  addRemarkController,
} from "../controllers/serviceRequest.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import { UserRole } from "../enum/user.enum.js";

const serviceRequestRouter = Router();

serviceRequestRouter.get("/health", (_, res) => {
  res.json({ success: true, message: "Service Request module working" });
});

serviceRequestRouter.use(authenticate);

// Student submits a request
serviceRequestRouter.post("/", submitServiceRequestController);

// List requests (filtered by role in service layer)
serviceRequestRouter.get("/", listServiceRequestsController);

// Get single request
serviceRequestRouter.get("/:id", getServiceRequestController);

// Staff/Admin review a request
serviceRequestRouter.patch(
  "/:id/review",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  reviewServiceRequestController,
);

// Student cancels own request
serviceRequestRouter.patch("/:id/cancel", cancelServiceRequestController);

// Add remark
serviceRequestRouter.post("/:id/remarks", addRemarkController);

export default serviceRequestRouter;
