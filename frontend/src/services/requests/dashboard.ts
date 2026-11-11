'use client'
import api from "../api"

export const allDashboardQueries = async () => {
  const res = await api.get("/dashboard");

  return res.data;
}
