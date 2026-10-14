export interface GeoPointDto {
  lat: number;
  lng: number;
}

export interface UserLocationDto {
  userId: number;
  fullName: string;
  avatarUrl?: string;
  role: string;
  lat: number;
  lng: number;
  accuracy: number;
  lastUpdated: string;
}

export interface UpdateLocationRequest {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface MapOrderDto {
  id: number;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  status: 'pending' | 'assigned' | 'accepted' | 'in_progress' | 'delivered' | 'cancelled';
  courierId?: number;
  courierName?: string;
  notes?: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  trackingPoints: OrderTrackingPointDto[];
  route?: DeliveryRouteDto;
}

export interface CreateMapOrderRequest {
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  notes?: string;
  totalAmount: number;
}

export interface OrderTrackingPointDto {
  id: number;
  orderId: number;
  lat: number;
  lng: number;
  status: string;
  note?: string;
  timestamp: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
  note?: string;
}

export interface AssignOrderRequest {
  courierId: number;
}

export interface RoutePointDto {
  lat: number;
  lng: number;
  instruction: string;
  distanceFromPrev: number;
  durationFromPrev: number;
}

export interface DeliveryRouteDto {
  id: number;
  orderId: number;
  totalDistanceKm: number;
  totalDurationMin: number;
  geometry: string;
  steps: RoutePointDto[];
  createdAt: string;
}

export interface PlanRouteRequest {
  orderId: number;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
}

export interface MapDashboardDto {
  pendingOrders: number;
  inProgressOrders: number;
  completedToday: number;
  activeCouriers: number;
  orders: MapOrderDto[];
}


