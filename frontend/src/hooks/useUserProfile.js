import { useState, useEffect, useCallback } from "react";
import * as api from "../lib/api.js";

export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile on mount
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getUserProfile();
      setProfile(data.result || data);
    } catch (err) {
      setError(err.message || "Failed to fetch profile");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update user profile
  const updateProfile = useCallback(async (updatedData) => {
    try {
      const updated = await api.updateUserProfile(updatedData);
      setProfile(updated.result || updated);
      return updated;
    } catch (err) {
      setError(err.message || "Failed to update profile");
      throw err;
    }
  }, []);

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
  };
};
