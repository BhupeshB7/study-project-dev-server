import { Router } from "express";
import {
  getImageKitAuthController,
  uploadDocumentController,
  getDocumentController,
  listDocumentsController,
  verifyDocumentController,
  deleteDocumentController,
} from "../controllers/document.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import { UserRole } from "../enum/user.enum.js";

const documentRouter = Router();

documentRouter.get("/health", (_, res) => {
  res.json({ success: true, message: "Document module working" });
});

documentRouter.use(authenticate);

// ImageKit auth params (for client-side uploads)
documentRouter.get("/auth", getImageKitAuthController);

// Upload document metadata (after client-side upload to ImageKit)
documentRouter.post("/", uploadDocumentController);

// List documents
documentRouter.get("/", listDocumentsController);

// Get single document
documentRouter.get("/:id", getDocumentController);

// Verify/reject document (Staff/Admin)
documentRouter.patch(
  "/:id/verify",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  verifyDocumentController,
);

// Delete document (Admin)
documentRouter.delete(
  "/:id",
  authorizeRoles(UserRole.ADMIN),
  deleteDocumentController,
);

export default documentRouter;
