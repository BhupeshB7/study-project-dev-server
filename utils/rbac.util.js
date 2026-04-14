import { ROLE_PERMISSIONS } from "../constants/roles_permission.js";


export const canUser = (user, permission, resource = null) => {
  if (!user) return false;

  const permissions = ROLE_PERMISSIONS[user.role] || [];

  if (permissions.includes(permission)) return true;

  if (
    permission.endsWith("_own") &&
    resource &&
    resource.createdBy &&
    String(resource.createdBy) === String(user._id)
  ) {
    return true;
  }

  return false;
};
