import { Router } from "express";
import {
  createWorkflowTemplateController,
  getWorkflowTemplateController,
  listWorkflowTemplatesController,
  updateWorkflowTemplateController,
  deleteWorkflowTemplateController,
  getWorkflowInstanceController,
  advanceWorkflowController,
  rejectWorkflowController,
} from "../controllers/workflow.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import { UserRole } from "../enum/user.enum.js";

const workflowRouter = Router();

workflowRouter.get("/health", (_, res) => {
  res.json({ success: true, message: "Workflow module working" });
});

workflowRouter.use(authenticate);

// --- Templates (Admin/Staff) ---
workflowRouter.post(
  "/templates",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  createWorkflowTemplateController,
);
workflowRouter.get("/templates", listWorkflowTemplatesController);
workflowRouter.get("/templates/:id", getWorkflowTemplateController);
workflowRouter.patch(
  "/templates/:id",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  updateWorkflowTemplateController,
);
workflowRouter.delete(
  "/templates/:id",
  authorizeRoles(UserRole.ADMIN),
  deleteWorkflowTemplateController,
);

// --- Instances (Engine) ---
workflowRouter.get("/instances/:id", getWorkflowInstanceController);
workflowRouter.patch(
  "/instances/:id/advance",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  advanceWorkflowController,
);
workflowRouter.patch(
  "/instances/:id/reject",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  rejectWorkflowController,
);

export default workflowRouter;
