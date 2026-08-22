import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import bcrypt from 'bcryptjs';
import { getDatabase } from './server/db.js';
import {
  UserDAO,
  PlanetDAO,
  PackageDAO,
  BookingDAO,
  PassengerDAO,
  PaymentDAO,
  MessageDAO,
  TestimonialDAO
} from './server/dao.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Initialize DB
  await getDatabase();

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', system: 'SPACED Interplanetary Flight Telemetry', version: '2.0.84' });
  });

  // ==========================================
  // AUTHENTICATION APIs
  // ==========================================

  // Register
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { full_name, email, password, phone } = req.body;

      if (!full_name || !email || !password) {
        return res.status(400).json({ error: 'Full name, email, and password are required.' });
      }

      if (!email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      }

      const existing = await UserDAO.findByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'This email address is already registered in the system.' });
      }

      const user = await UserDAO.create(full_name, email, password, phone || '');
      return res.status(201).json({ message: 'User registered successfully', user });
    } catch (err: unknown) {
      console.error('Registration error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Registration failed.';
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = await UserDAO.findByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const safeUser = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        created_at: user.created_at
      };

      return res.json({ message: 'Login successful', user: safeUser });
    } catch (err: unknown) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Internal server error during authentication.' });
    }
  });

  // Update Profile
  app.put('/api/auth/profile', async (req, res) => {
    try {
      const { userId, full_name, phone } = req.body;
      if (!userId || !full_name) {
        return res.status(400).json({ error: 'User ID and full name are required.' });
      }
      const updated = await UserDAO.updateProfile(Number(userId), full_name, phone || '');
      return res.json({ message: 'Profile updated successfully', user: updated });
    } catch (err: unknown) {
      return res.status(500).json({ error: 'Failed to update profile.' });
    }
  });

  // ==========================================
  // PLANETS APIs
  // ==========================================

  app.get('/api/planets', async (req, res) => {
    try {
      const planets = await PlanetDAO.getAll();
      return res.json(planets);
    } catch (err: unknown) {
      console.error('Fetch planets error:', err);
      return res.status(500).json({ error: 'Failed to retrieve planets.' });
    }
  });

  app.get('/api/planets/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid planet ID format.' });
      }
      const planet = await PlanetDAO.getById(id);
      if (!planet) {
        return res.status(404).json({ error: 'Planet not found.' });
      }
      return res.json(planet);
    } catch (err: unknown) {
      return res.status(500).json({ error: 'Failed to fetch planet details.' });
    }
  });

  // ==========================================
  // PACKAGES APIs
  // ==========================================

  app.get('/api/packages', async (req, res) => {
    try {
      const packages = await PackageDAO.getAll();
      return res.json(packages);
    } catch (err: unknown) {
      return res.status(500).json({ error: 'Failed to retrieve travel packages.' });
    }
  });

  app.get('/api/packages/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const pkg = await PackageDAO.getById(id);
      if (!pkg) return res.status(404).json({ error: 'Package not found.' });
      return res.json(pkg);
    } catch (err: unknown) {
      return res.status(500).json({ error: 'Failed to retrieve package.' });
    }
  });

  // ==========================================
  // BOOKINGS APIs
  // ==========================================

  app.post('/api/bookings', async (req, res) => {
    try {
      const { userId, planetId, packageId, travelers, departureDate, passengers } = req.body;

      if (!userId || !planetId || !packageId || !travelers || !departureDate) {
        return res.status(400).json({ error: 'Missing required booking fields (user, planet, package, travelers, date).' });
      }

      if (!Array.isArray(passengers) || passengers.length !== Number(travelers)) {
        return res.status(400).json({ error: `Passenger list count (${passengers?.length || 0}) must match travelers count (${travelers}).` });
      }

      const booking = await BookingDAO.createBooking(
        Number(userId),
        Number(planetId),
        Number(packageId),
        Number(travelers),
        departureDate,
        passengers
      );

      return res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (err: unknown) {
      console.error('Booking creation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking.';
      return res.status(500).json({ error: errorMessage });
    }
  });

  app.get('/api/bookings/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const booking = await BookingDAO.getById(id);
      if (!booking) return res.status(404).json({ error: 'Booking record not found.' });
      return res.json(booking);
    } catch (err: unknown) {
      return res.status(500).json({ error: 'Failed to retrieve booking.' });
    }
  });

  app.get('/api/bookings/user/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const bookings = await BookingDAO.getByUserId(userId);
      return res.json(bookings);
    } catch (err: unknown) {
      return res.status(500).json({ error: 'Failed to retrieve user bookings.' });
    }
  });

  app.post('/api/bookings/:id/cancel', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { userId } = req.body;
      const success = await BookingDAO.cancelBooking(id, Number(userId));
      if (!success) return res.status(400).json({ error: 'Unable to cancel this mission booking.' });
      return res.json({ message: 'Mission booking cancelled successfully.' });
    } catch (err: unknown) {
      return res.status(500).json({ error: 'Failed to cancel booking.' });
    }
  });

  // ==========================================
  // PAYMENTS APIs (Simulated Demo Gateway)
  // ==========================================

  app.post('/api/payments', async (req, res) => {
    try {
      const { bookingId, cardNumber, expiry, cvv, cardHolder, amount } = req.body;

      if (!bookingId || !cardNumber || !expiry || !cvv || !cardHolder) {
        return res.status(400).json({ error: 'All payment fields are required.' });
      }

      // Clean card number
      const sanitizedCard = String(cardNumber).replace(/\s+/g, '');
      if (sanitizedCard.length < 13 || sanitizedCard.length > 19) {
        return res.status(400).json({ error: 'Invalid card number length for demo verification.' });
      }

      if (String(cvv).length < 3 || String(cvv).length > 4) {
        return res.status(400).json({ error: 'Invalid CVV code.' });
      }

      const booking = await BookingDAO.getById(Number(bookingId));
      if (!booking) {
        return res.status(404).json({ error: 'Associated mission booking not found.' });
      }

      // Generate fake transaction ID
      const timestamp = Date.now().toString().slice(-6);
      const randomCode = Math.floor(Math.random() * 89999 + 10000);
      const transactionId = `SPC-2026-${randomCode}${timestamp.slice(-2)}`;

      const lastFour = sanitizedCard.slice(-4);

      const paymentRecord = await PaymentDAO.create({
        booking_id: Number(bookingId),
        transaction_id: transactionId,
        amount: Number(amount) || booking.total_amount,
        payment_method: 'DEMO_SPACE_CARD',
        card_last_four: lastFour,
        payment_status: 'COMPLETED'
      });

      return res.json({
        message: 'Payment verified and processed successfully',
        transaction_id: transactionId,
        booking_id: bookingId,
        status: 'CONFIRMED',
        payment: paymentRecord
      });
    } catch (err: unknown) {
      console.error('Payment processing error:', err);
      return res.status(500).json({ error: 'Payment processing encountered a critical gateway fault.' });
    }
  });

  app.get('/api/payments/:bookingId', async (req, res) => {
    try {
      const bookingId = parseInt(req.params.bookingId, 10);
      const payment = await PaymentDAO.getByBookingId(bookingId);
      if (!payment) return res.status(404).json({ error: 'Payment record not found for this booking.' });
      return res.json(payment);
    } catch (err: unknown) {
      return res.status(500).json({ error: 'Failed to retrieve payment record.' });
    }
  });

  // ==========================================
  // PASSENGERS APIs
  // ==========================================

  app.get('/api/passengers/booking/:bookingId', async (req, res) => {
    try {
      const bookingId = parseInt(req.params.bookingId, 10);
      const passengers = await PassengerDAO.getByBookingId(bookingId);
      return res.json(passengers);
    } catch (err: unknown) {
      return res.status(500).json({ error: 'Failed to retrieve passenger manifests.' });
    }
  });

  // ==========================================
  // MESSAGES APIs
  // ==========================================

  app.post('/api/messages', async (req, res) => {
    try {
      const { sender_name, email, subject, message, userId } = req.body;

      if (!sender_name || !email || !message) {
        return res.status(400).json({ error: 'ComLink Name, Frequency Email, and Transmission Message are required.' });
      }

      await MessageDAO.create({
        sender_name,
        email,
        subject: subject || 'General Interplanetary Inquiry',
        message,
        user_id: userId ? Number(userId) : undefined
      });

      return res.status(201).json({
        message: 'Sub-space transmission broadcasted and logged successfully into telemetry archives.'
      });
    } catch (err: unknown) {
      return res.status(500).json({ error: 'Failed to broadcast message transmission.' });
    }
  });

  app.get('/api/messages/user/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const msgs = await MessageDAO.getByUserId(userId);
      return res.json(msgs);
    } catch (err: unknown) {
      return res.status(500).json({ error: 'Failed to retrieve message transmissions.' });
    }
  });

  // ==========================================
  // TESTIMONIALS & STATS APIs
  // ==========================================

  app.get('/api/testimonials', async (req, res) => {
    try {
      const testimonials = await TestimonialDAO.getAll();
      return res.json(testimonials);
    } catch (err: unknown) {
      return res.status(500).json({ error: 'Failed to fetch passenger logs.' });
    }
  });

  app.get('/api/stats', async (req, res) => {
    try {
      const planets = await PlanetDAO.getAll();
      return res.json({
        destinations: `${planets.length}+`,
        travelers: '25,480+',
        safetyRating: '99.9%',
        completedMissions: '142',
        activeFleet: '18 Orbital Carriers'
      });
    } catch (err: unknown) {
      return res.status(500).json({ error: 'Failed to retrieve telemetry stats.' });
    }
  });

  // ==========================================
  // VITE & STATIC FILES
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true' ? true : false,
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SPACED Interplanetary Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
