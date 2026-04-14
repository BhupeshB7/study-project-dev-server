import { mailTransporter } from "../config/mailer.js";
import config from "../config/constant.js";
import { renderTemplate } from "../utils/email-template.js";
import logger from "../utils/logger.js";

const emailLogger = logger.namespaceLogger("EMAIL");

export const emailProcessor = async (job) => {
  const { type, to, subject, data } = job.data;

  emailLogger.info(`Processing email job: ${type}`, { to });

  try {
    let html;

    switch (type) {
      case "welcome":
        html = renderTemplate("welcome-user.html", {
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          instituteName: data.instituteName,
          loginUrl: `${config.CLIENT_URL}/login`,
          year: new Date().getFullYear(),
        });
        break;

      case "otp":
        html = renderTemplate("otp-verification.html", {
          userName: data.fullName,
          otp: data.otp,
          year: new Date().getFullYear(),
        });
        break;

      case "password-reset":
        html = renderTemplate("password-reset.html", {
          userName: data.fullName,
          resetUrl: data.resetUrl,
          year: new Date().getFullYear(),
        });
        break;

      case "notification":
        html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2>${data.title}</h2>
            <p>${data.message}</p>
            <hr/>
            <p style="color:#666;font-size:12px">Study Project - ${new Date().getFullYear()}</p>
          </div>
        `;
        break;

      default:
        emailLogger.warn(`Unknown email type: ${type}`);
        return;
    }

    await mailTransporter.sendMail({
      from: config.EMAIL_FROM,
      to,
      subject: subject || "Study Project Notification",
      html,
    });

    emailLogger.success(`Email sent: ${type}`, { to });
  } catch (error) {
    emailLogger.error(`Email failed: ${type}`, {
      to,
      message: error.message,
    });
    throw error;
  }
};
