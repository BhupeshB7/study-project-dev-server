import { Router } from "express";
import {
  createUserByInstituteController,
  forgotPassword,
  getActiveSessions,
  getUserProfile,
  loginUserController,
  logoutAllDevicesController,
  logoutUserController,
  registerUser,
  resetPassword,
  verifyOtpAndCreateUser,
} from "../controllers/user.controller.js";
import {
  forgotPasswordDto,
  loginDto,
  registerDto,
  resetPasswordDto,
  verifyOtpDto,
} from "../dtos/auth.dto.js";
import { UserRole } from "../enum/user.enum.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import { validateBody } from "../validators/validateBody.js";
import { createUserDto } from "../dtos/user.dto.js";

const userRouter = Router();

userRouter.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "User route is working!" });
});

userRouter.post("/register", validateBody(registerDto), registerUser);
userRouter.post(
  "/verify-otp",
  validateBody(verifyOtpDto),
  verifyOtpAndCreateUser,
);
userRouter.post("/login", validateBody(loginDto), loginUserController);
userRouter.post(
  "/forgot-password",
  validateBody(forgotPasswordDto),
  forgotPassword,
);
userRouter.post(
  "/reset-password",
  validateBody(resetPasswordDto),
  resetPassword,
);

//private router
userRouter.use(authenticate);
userRouter.post("/logout", logoutUserController);
userRouter.post("/logout-all", logoutAllDevicesController);
userRouter.get("/sessions", getActiveSessions);
userRouter.post(
  "/create",
  authorizeRoles(UserRole.SYSTEM_ADMIN, UserRole.ADMIN, UserRole.STAFF),
  validateBody(createUserDto),
  createUserByInstituteController,
);

userRouter.get(
  "/profile",
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF, UserRole.STUDENT),
  getUserProfile,
);

export default userRouter;
