import { create } from "zustand";
import * as api from "../lib/api.js";

export const useProfileStore = create((set, get) => ({
  profile: null,
  loading: true,
  error: null,

  // Fetch user profile
  fetchProfile: async () => {
    try {
      set({ loading: true, error: null });
      const data = await api.getUserProfile();
      set({ profile: data.result || data, loading: false });
    } catch (err) {
      set({
        error: err.message || "Failed to fetch profile",
        loading: false
      });
      console.error("Error fetching profile:", err);
    }
  },

  // Update user profile
  updateProfile: async (updatedData) => {
    try {
      const updated = await api.updateUserProfile(updatedData);
      set({ profile: updated.result || updated });
      return updated;
    } catch (err) {
      set({ error: err.message || "Failed to update profile" });
      throw err;
    }
  },

  // Refresh profile (alias for fetchProfile)
  refreshProfile: async () => {
    await get().fetchProfile();
  },

  // Clear profile (for logout)
  clearProfile: () => set({ profile: null, loading: false, error: null }),
}));