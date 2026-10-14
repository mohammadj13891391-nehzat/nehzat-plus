export interface CourierStatsDto {
  courierUserId: number;
  courierName: string;
  periodStart: string;
  periodEnd: string;
  totalDeliveries: number;
  totalDistance: number;
  totalEarnings: number;
  dailyAverage: number;
  dailyBreakdown: CourierDailyStatDto[];
}

export interface CourierDailyStatDto {
  date: string;
  deliveredCount: number;
  distanceKm: number;
  earningsAmount: number;
  averageDeliveryMinutes: number;
}

export interface CourierLeaderboardDto {
  entries: CourierLeaderboardEntryDto[];
}

export interface CourierLeaderboardEntryDto {
  rank: number;
  courierUserId: number;
  courierName: string;
  totalDeliveries: number;
  totalEarnings: number;
}

// ===== Progress Module (Phase 10) =====

