export const hasAccess = (userData, allowedRoles) => {
  return userData ? allowedRoles.includes(userData?.rollSelect) : true;
};
