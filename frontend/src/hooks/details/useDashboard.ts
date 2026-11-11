"use client"
import { useQuery } from "@tanstack/react-query"

import { allDashboardQueries } from "@/services/requests/dashboard"
import { Queries } from "@/types/queries"

export const useDashboard = () => {
  return useQuery({
    queryKey: [Queries.DETAILS_DASHBOARD],
    queryFn: allDashboardQueries
  })
}
