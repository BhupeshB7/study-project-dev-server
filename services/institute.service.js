import { InstituteModel } from "../models/institute.model.js";
import { UserRole } from "../enum/user.enum.js";

export const listInstitutes = async () => {
  const institutes = await InstituteModel.find({ isActive: true })
    .select("name code")
    .sort({ name: 1 })
    .lean();
  return institutes;
};

export const createInstitute = async (payload, user) => {
  if (!user || user.role !== UserRole.SYSTEM_ADMIN) {
    const err = new Error("Only system admin can create institute");
    err.statusCode = 403;
    throw err;
  }

  const exists = await InstituteModel.findOne({ code: payload.code });
  if (exists) {
    const err = new Error("Institute with this code already exists");
    err.statusCode = 409;
    throw err;
  }

  const institute = await InstituteModel.create({
    ...payload,
    createdBy: user._id,
  });

  return institute;
};
