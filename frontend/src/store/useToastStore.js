import { create } from "zustand";

export const useToastStore = create((set) => ({
  toasts: [],

  // Add a new toast
  addToast: (message, type = "info", duration = 3000) => {
    const id = Date.now();
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          message,
          type, // 'success', 'error', 'info', 'warning'
          duration,
        },
      ],
    }));

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  // Remove a specific toast
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  // Clear all toasts
  clearToasts: () => set({ toasts: [] }),
}));

export const showToast = {
  success: (message) => useToastStore.getState().addToast(message, "success", 3000),
  error: (message) => useToastStore.getState().addToast(message, "error", 4000),
  info: (message) => useToastStore.getState().addToast(message, "info", 3000),
  warning: (message) => useToastStore.getState().addToast(message, "warning", 3000),
};
