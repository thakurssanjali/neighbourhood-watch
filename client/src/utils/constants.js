// Constants for the application
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  MEMBERS: "/members",
  ABOUT: "/about",
  CONTACT: "/contact",
  USER_DASHBOARD: "/user/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard"
};

export const ROLES = {
  USER: "user",
  ADMIN: "admin"
};

export const INCIDENT_STATUSES = {
  PENDING: "Pending",
  ACTIONING: "Actioning",
  RESOLVED: "Resolved"
};

export const EVENT_CATEGORIES = [
  "Dance",
  "Concert",
  "Lunch",
  "Urgent Meeting",
  "Festival",
  "Casual Gathering"
];

export const EVENT_GIFS = {
  Dance: "/images/event-gifs/dance.gif",
  Concert: "/images/event-gifs/concert.gif",
  Lunch: "/images/event-gifs/lunch.gif",
  "Urgent Meeting": "/images/event-gifs/urgent-meeting.gif",
  Festival: "/images/event-gifs/festival.gif",
  "Casual Gathering": "/images/event-gifs/casual.gif"
};

export const STORAGE_KEYS = {
  TOKEN: "token",
  ROLE: "role",
  NAME: "name"
};

// Helper function to get current user
export const getCurrentUser = () => ({
  token: localStorage.getItem(STORAGE_KEYS.TOKEN),
  role: localStorage.getItem(STORAGE_KEYS.ROLE),
  name: localStorage.getItem(STORAGE_KEYS.NAME),
  isLoggedIn: !!localStorage.getItem(STORAGE_KEYS.TOKEN)
});

// Helper function to clear user data
export const clearUserData = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.ROLE);
  localStorage.removeItem(STORAGE_KEYS.NAME);
};

// Helper function to set user data
export const setUserData = (token, role, name) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.ROLE, role);
  localStorage.setItem(STORAGE_KEYS.NAME, name);
};
