import { Router } from "express";
import {
  askQuestionController,
  listFaqCategoriesController,
  listFaqsByCategoryController,
  createFaqController,
  updateFaqController,
  deleteFaqController,
  listFaqsController,
} from "../controllers/chat.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import { UserRole } from "../enum/user.enum.js";

const chatRouter = Router();

chatRouter.get("/health", (_, res) => {
  res.json({ success: true, message: "Chat module working" });
});

chatRouter.use(authenticate);

// Student/User chat endpoints
chatRouter.post("/ask", askQuestionController);
chatRouter.get("/categories", listFaqCategoriesController);
chatRouter.get("/categories/:category", listFaqsByCategoryController);

// FAQ management (Admin/Staff)
chatRouter.get(
  "/faqs",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  listFaqsController,
);
chatRouter.post(
  "/faqs",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  createFaqController,
);
chatRouter.patch(
  "/faqs/:id",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  updateFaqController,
);
chatRouter.delete(
  "/faqs/:id",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  deleteFaqController,
);

export default chatRouter;
