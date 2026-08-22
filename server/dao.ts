import { getDatabase, saveDatabase } from './db';
import { Database } from 'sql.js';
import bcrypt from 'bcryptjs';

// Model Interfaces
export interface User {
  id: number;
  full_name: string;
  email: string;
  password?: string;
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

// User DAO
export class UserDAO {
  static async findByEmail(email: string): Promise<User | null> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)');
    stmt.bind([email.trim()]);
    if (stmt.step()) {
      const row = stmt.getAsObject() as unknown as User;
      stmt.free();
      return row;
    }
    stmt.free();
    return null;
  }

  static async findById(id: number): Promise<User | null> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT id, full_name, email, phone, created_at FROM users WHERE id = ?');
    stmt.bind([id]);
    if (stmt.step()) {
      const row = stmt.getAsObject() as unknown as User;
      stmt.free();
      return row;
    }
    stmt.free();
    return null;
  }

  static async create(fullName: string, email: string, passwordPlain: string, phone: string = ''): Promise<User> {
    const db = await getDatabase();
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(passwordPlain, salt);

    db.run(
      'INSERT INTO users (full_name, email, password, phone) VALUES (?, ?, ?, ?)',
      [fullName.trim(), email.trim().toLowerCase(), hashedPassword, phone.trim()]
    );

    saveDatabase(db);
    const createdUser = await this.findByEmail(email);
    if (!createdUser) {
      throw new Error('User creation failed in database.');
    }
    delete createdUser.password;
    return createdUser;
  }

  static async updateProfile(id: number, fullName: string, phone: string): Promise<User | null> {
    const db = await getDatabase();
    db.run('UPDATE users SET full_name = ?, phone = ? WHERE id = ?', [fullName.trim(), phone.trim(), id]);
    saveDatabase(db);
    return this.findById(id);
  }
}

// Planet DAO
export class PlanetDAO {
  static async getAll(): Promise<Planet[]> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM planets ORDER BY id ASC');
    const planets: Planet[] = [];
    while (stmt.step()) {
      planets.push(stmt.getAsObject() as unknown as Planet);
    }
    stmt.free();
    return planets;
  }

  static async getById(id: number): Promise<Planet | null> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM planets WHERE id = ?');
    stmt.bind([id]);
    if (stmt.step()) {
      const row = stmt.getAsObject() as unknown as Planet;
      stmt.free();
      return row;
    }
    stmt.free();
    return null;
  }
}

// Package DAO
export class PackageDAO {
  static async getAll(): Promise<TravelPackage[]> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM packages ORDER BY price ASC');
    const packages: TravelPackage[] = [];
    while (stmt.step()) {
      packages.push(stmt.getAsObject() as unknown as TravelPackage);
    }
    stmt.free();
    return packages;
  }

  static async getById(id: number): Promise<TravelPackage | null> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM packages WHERE id = ?');
    stmt.bind([id]);
    if (stmt.step()) {
      const row = stmt.getAsObject() as unknown as TravelPackage;
      stmt.free();
      return row;
    }
    stmt.free();
    return null;
  }
}

// Passenger DAO
export class PassengerDAO {
  static async create(bookingId: number, passenger: Passenger): Promise<void> {
    const db = await getDatabase();
    db.run(
      `INSERT INTO passengers (booking_id, full_name, email, phone, date_of_birth, passport_number, emergency_contact)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingId,
        passenger.full_name,
        passenger.email,
        passenger.phone,
        passenger.date_of_birth,
        passenger.passport_number,
        passenger.emergency_contact
      ]
    );
    saveDatabase(db);
  }

  static async getByBookingId(bookingId: number): Promise<Passenger[]> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM passengers WHERE booking_id = ?');
    stmt.bind([bookingId]);
    const passengers: Passenger[] = [];
    while (stmt.step()) {
      passengers.push(stmt.getAsObject() as unknown as Passenger);
    }
    stmt.free();
    return passengers;
  }
}

// Payment DAO
export class PaymentDAO {
  static async create(payment: Payment): Promise<Payment> {
    const db = await getDatabase();
    db.run(
      `INSERT INTO payments (booking_id, transaction_id, amount, payment_method, card_last_four, payment_status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        payment.booking_id,
        payment.transaction_id,
        payment.amount,
        payment.payment_method,
        payment.card_last_four,
        payment.payment_status
      ]
    );

    // Update booking status
    db.run(`UPDATE bookings SET booking_status = 'CONFIRMED' WHERE id = ?`, [payment.booking_id]);
    saveDatabase(db);

    return payment;
  }

  static async getByBookingId(bookingId: number): Promise<Payment | null> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM payments WHERE booking_id = ?');
    stmt.bind([bookingId]);
    if (stmt.step()) {
      const row = stmt.getAsObject() as unknown as Payment;
      stmt.free();
      return row;
    }
    stmt.free();
    return null;
  }
}

// Booking DAO
export class BookingDAO {
  static async createBooking(
    userId: number,
    planetId: number,
    packageId: number,
    travelers: number,
    departureDate: string,
    passengers: Passenger[]
  ): Promise<Booking> {
    const db = await getDatabase();

    // Verify planet and package
    const planet = await PlanetDAO.getById(planetId);
    if (!planet) throw new Error('Selected planet not found in database.');

    const pkg = await PackageDAO.getById(packageId);
    if (!pkg) throw new Error('Selected travel package not found in database.');

    // Dynamic backend price calculation
    const basePrice = Number(planet.price);
    const packagePrice = Number(pkg.price);
    const travelersCount = Number(travelers) || 1;
    const totalAmount = (basePrice * travelersCount) + packagePrice;

    // Generate unique booking reference
    const timestamp = Date.now().toString().slice(-5);
    const randomHex = Math.floor(Math.random() * 899 + 100);
    const refCode = `SPC-${planet.name.toUpperCase().replace(/\s+/g, '')}-${randomHex}${timestamp.slice(-2)}`;

    db.run(
      `INSERT INTO bookings (booking_reference, user_id, planet_id, package_id, travelers, departure_date, total_amount, booking_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
      [refCode, userId, planetId, packageId, travelersCount, departureDate, totalAmount]
    );

    // Get last insert ID
    const idStmt = db.prepare('SELECT last_insert_rowid() as id');
    idStmt.step();
    const bookingId = (idStmt.getAsObject() as { id: number }).id;
    idStmt.free();

    // Insert passengers
    for (const p of passengers) {
      await PassengerDAO.create(bookingId, p);
    }

    saveDatabase(db);

    const booking = await this.getById(bookingId);
    if (!booking) throw new Error('Failed to retrieve newly created booking.');
    return booking;
  }

  static async getById(bookingId: number): Promise<Booking | null> {
    const db = await getDatabase();
    const stmt = db.prepare(`
      SELECT b.*, p.name as planet_name, p.image_url as planet_image, pkg.name as package_name
      FROM bookings b
      LEFT JOIN planets p ON b.planet_id = p.id
      LEFT JOIN packages pkg ON b.package_id = pkg.id
      WHERE b.id = ?
    `);
    stmt.bind([bookingId]);
    if (stmt.step()) {
      const booking = stmt.getAsObject() as unknown as Booking;
      stmt.free();

      // Attach passengers and payment
      booking.passengers = await PassengerDAO.getByBookingId(bookingId);
      booking.payment = await PaymentDAO.getByBookingId(bookingId) || undefined;
      return booking;
    }
    stmt.free();
    return null;
  }

  static async getByReference(reference: string): Promise<Booking | null> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT id FROM bookings WHERE booking_reference = ?');
    stmt.bind([reference.trim()]);
    if (stmt.step()) {
      const { id } = stmt.getAsObject() as { id: number };
      stmt.free();
      return this.getById(id);
    }
    stmt.free();
    return null;
  }

  static async getByUserId(userId: number): Promise<Booking[]> {
    const db = await getDatabase();
    const stmt = db.prepare(`
      SELECT b.*, p.name as planet_name, p.image_url as planet_image, pkg.name as package_name
      FROM bookings b
      LEFT JOIN planets p ON b.planet_id = p.id
      LEFT JOIN packages pkg ON b.package_id = pkg.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `);
    stmt.bind([userId]);
    const bookings: Booking[] = [];
    while (stmt.step()) {
      bookings.push(stmt.getAsObject() as unknown as Booking);
    }
    stmt.free();

    // Attach payments and passenger counts
    for (const b of bookings) {
      b.payment = await PaymentDAO.getByBookingId(b.id) || undefined;
      b.passengers = await PassengerDAO.getByBookingId(b.id);
    }

    return bookings;
  }

  static async cancelBooking(bookingId: number, userId: number): Promise<boolean> {
    const db = await getDatabase();
    const b = await this.getById(bookingId);
    if (!b || b.user_id !== userId) return false;

    db.run(`UPDATE bookings SET booking_status = 'CANCELLED' WHERE id = ?`, [bookingId]);
    saveDatabase(db);
    return true;
  }
}

// Message DAO
export class MessageDAO {
  static async create(message: Message): Promise<Message> {
    const db = await getDatabase();
    db.run(
      `INSERT INTO messages (user_id, sender_name, email, subject, message)
       VALUES (?, ?, ?, ?, ?)`,
      [
        message.user_id || null,
        message.sender_name.trim(),
        message.email.trim(),
        message.subject.trim(),
        message.message.trim()
      ]
    );
    saveDatabase(db);
    return message;
  }

  static async getByUserId(userId: number): Promise<Message[]> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM messages WHERE user_id = ? ORDER BY created_at DESC');
    stmt.bind([userId]);
    const list: Message[] = [];
    while (stmt.step()) {
      list.push(stmt.getAsObject() as unknown as Message);
    }
    stmt.free();
    return list;
  }
}

// Testimonial DAO
export class TestimonialDAO {
  static async getAll(): Promise<Testimonial[]> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM testimonials ORDER BY id ASC');
    const list: Testimonial[] = [];
    while (stmt.step()) {
      list.push(stmt.getAsObject() as unknown as Testimonial);
    }
    stmt.free();
    return list;
  }
}
