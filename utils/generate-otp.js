import crypto from "crypto";
import bcrypt from "bcrypt";

export const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};
export const hashOtp = (otp) => {
  return bcrypt.hashSync(otp, 10);
};

export const compareOtp = (otp, hashedOTP) => {
  return bcrypt.compareSync(otp, hashedOTP);
};
