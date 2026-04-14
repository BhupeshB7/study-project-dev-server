import { mailTransporter } from "../config/mailer.js";
import config from "../config/constant.js";
import logger from "../utils/logger.js";
import { renderTemplate } from "../utils/email-template.js";

const emailLogger = logger.namespaceLogger("EMAIL");

export const sendWelcomeUserEmail = async ({
  to,
  fullName,
  email,
  password,
  instituteName,
}) => {
  try {
    const html = renderTemplate("welcome-user.html", {
      fullName,
      email,
      password,
      instituteName,
      loginUrl: `${config.CLIENT_URL}/login`,
      year: new Date().getFullYear(),
    });

    await mailTransporter.sendMail({
      from: config.EMAIL_FROM,
      to,
      subject: "Welcome to the Institute Portal",
      html,
    });

    emailLogger.success("Welcome email sent", { to });
  } catch (error) {
    emailLogger.error("Welcome email failed", {
      message: error.message,
    });
    throw new Error("Failed to send welcome email");
  }
};

export const sendOtpEmail = async ({ to, otp, fullName }) => {
  try {
    const html = renderTemplate("otp-verification.html", {
      userName: fullName,
      otp,
      year: new Date().getFullYear(),
    });

    await mailTransporter.sendMail({
      from: config.EMAIL_FROM,
      to,
      subject: "Email Verification Code",
      html,
    });

    emailLogger.success("OTP email sent", { to });
    return true;
  } catch (error) {
    emailLogger.error("Failed to send OTP email", {
      message: error.message,
      stack: error.stack,
    });

    throw new Error("Failed to send OTP email");
  }
};

export const sendPasswordResetEmail = async ({ to, resetUrl, fullName }) => {
  try {
    const html = renderTemplate("password-reset.html", {
      userName: fullName,
      resetUrl,
      year: new Date().getFullYear(),
    });

    await mailTransporter.sendMail({
      from: config.EMAIL_FROM,
      to,
      subject: "Reset your password — StudyProject",
      html,
    });

    emailLogger.success("Password reset email sent", { to });
    return true;
  } catch (error) {
    emailLogger.error("Failed to send password reset email", {
      message: error.message,
      stack: error.stack,
    });

    throw new Error("Failed to send password reset email");
  }
};
