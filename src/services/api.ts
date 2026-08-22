import { User, Planet, TravelPackage, Booking, Passenger, Payment, Message, Testimonial, Stats } from '../types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (data: { full_name: string; email: string; password: string; phone?: string }) =>
    request<{ message: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ message: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProfile: (data: { userId: number; full_name: string; phone?: string }) =>
    request<{ message: string; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Planets
  getPlanets: () => request<Planet[]>('/planets'),
  getPlanetById: (id: number | string) => request<Planet>(`/planets/${id}`),

  // Packages
  getPackages: () => request<TravelPackage[]>('/packages'),
  getPackageById: (id: number | string) => request<TravelPackage>(`/packages/${id}`),

  // Bookings
  createBooking: (data: {
    userId: number;
    planetId: number;
    packageId: number;
    travelers: number;
    departureDate: string;
    passengers: Passenger[];
  }) =>
    request<{ message: string; booking: Booking }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getBookingById: (id: number | string) => request<Booking>(`/bookings/${id}`),
  getUserBookings: (userId: number | string) => request<Booking[]>(`/bookings/user/${userId}`),
  cancelBooking: (id: number | string, userId: number) =>
    request<{ message: string }>(`/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  // Payments
  processPayment: (data: {
    bookingId: number;
    cardNumber: string;
    expiry: string;
    cvv: string;
    cardHolder: string;
    amount: number;
  }) =>
    request<{
      message: string;
      transaction_id: string;
      booking_id: number;
      status: string;
      payment: Payment;
    }>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getPayment: (bookingId: number | string) => request<Payment>(`/payments/${bookingId}`),

  // Messages / Transmission
  sendMessage: (data: {
    sender_name: string;
    email: string;
    subject?: string;
    message: string;
    userId?: number;
  }) =>
    request<{ message: string }>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getUserMessages: (userId: number | string) => request<Message[]>(`/messages/user/${userId}`),

  // Testimonials & Stats
  getTestimonials: () => request<Testimonial[]>('/testimonials'),
  getStats: () => request<Stats>('/stats'),
};
