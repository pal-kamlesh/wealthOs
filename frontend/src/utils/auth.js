// Auth utility functions

export const getToken = () => localStorage.getItem("token");

export const setToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  }
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const clearAuth = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => !!getToken();
