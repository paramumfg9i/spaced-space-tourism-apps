export interface User {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  created_at?: string;
}

export interface Planet {
  id: number;
  name: string;
  planet_type: string;
  description: string;
  distance_from_earth: string;
  travel_time: string;
  temperature: string;
  gravity: string;
  atmosphere: string;
  mission_duration: string;
  price: number;
  image_url: string;
  tagline?: string;
  featured_highlight?: string;
  available: number;
}

export interface TravelPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  features?: string;
}

export interface Passenger {
  id?: number;
  booking_id?: number;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  passport_number: string;
  emergency_contact: string;
}

export interface Payment {
  id?: number;
  booking_id: number;
  transaction_id: string;
  amount: number;
  payment_method: string;
  card_last_four: string;
  payment_status: string;
  payment_date?: string;
}

export interface Booking {
  id: number;
  booking_reference: string;
  user_id: number;
  planet_id: number;
  package_id: number;
  travelers: number;
  departure_date: string;
  total_amount: number;
  booking_status: string;
  created_at: string;
  planet_name?: string;
  planet_image?: string;
  package_name?: string;
  passengers?: Passenger[];
  payment?: Payment;
}

export interface Message {
  id?: number;
  user_id?: number;
  sender_name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  mission: string;
  rating: number;
  quote: string;
  avatar_url: string;
  date: string;
}

export interface Stats {
  destinations: string;
  travelers: string;
  safetyRating: string;
  completedMissions: string;
  activeFleet: string;
}
