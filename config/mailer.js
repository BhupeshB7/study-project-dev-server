import nodemailer from "nodemailer";
import config from "./constant.js";
import logger from "../utils/logger.js";

const mailLogger = logger.namespaceLogger("MAILER");

export const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD,
  },
});

mailTransporter
  .verify()
  .then(() => {
    mailLogger.success("Email transporter ready");
  })
  .catch((error) => {
    mailLogger.error("Email transporter failed", {
      message: error.message,
    });
  });
