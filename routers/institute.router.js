import { Router } from "express";
import { createInstituteController, listInstitutesController } from "../controllers/institute.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import { validateBody } from "../validators/validateBody.js";
import { createInstituteDto } from "../dtos/institute.dto.js";
import { UserRole } from "../enum/user.enum.js";

const instituteRouter = Router();

instituteRouter.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Institute route working",
  });
});

instituteRouter.get("/list", listInstitutesController);

instituteRouter.post(
  "/",
  authenticate,
  authorizeRoles(UserRole.SYSTEM_ADMIN),
  validateBody(createInstituteDto),
  createInstituteController,
);

export default instituteRouter;
