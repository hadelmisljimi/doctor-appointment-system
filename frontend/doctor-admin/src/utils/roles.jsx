export const getRole = () => localStorage.getItem("role");

export const isAdmin = () => getRole() === "ADMIN";
export const isDoctor = () => getRole() === "DOCTOR";
export const isPatient = () => getRole() === "PATIENT";