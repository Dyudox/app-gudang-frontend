import { PERMISSIONS } from "../config/constants.js";

export const useAccess = (permissionKey) => {
  const userStorage = localStorage.getItem("user");
  const userData = userStorage ? JSON.parse(userStorage) : null;

  // LOG PENTING:
  // console.log("--- DEBUG ACCESS ---");
  // console.log("Checking Permission Key:", permissionKey);
  // console.log("Raw User Data from localStorage:", userData);
  // console.log("User Group ID (raw):", userData?.user_group_id);

  const currentGroupId = parseInt(userData?.user_group_id);
  const allowedGroups = PERMISSIONS[permissionKey];

  // console.log("Parsed Group ID:", currentGroupId);
  // console.log("Allowed Groups List:", allowedGroups);
  // console.log("Permission Granted:", allowedGroups?.includes(currentGroupId));

  return allowedGroups?.includes(currentGroupId) || false;
};

// export const useAccess = (permissionKey) => {
//   const userData = JSON.parse(localStorage.getItem("user"));
//   const currentGroupId = userData?.user_group_id;

//   // Cek apakah group_id user ada dalam daftar izin yang diizinkan
//   return PERMISSIONS[permissionKey]?.includes(currentGroupId) || false;
// };
