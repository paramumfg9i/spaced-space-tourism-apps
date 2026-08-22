import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

let dbInstance: Database | null = null;
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'spaced.sqlite');

export async function getDatabase(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      dbInstance = new SQL.Database(fileBuffer);
    } catch (e) {
      console.warn('Could not read existing database file, creating fresh database...', e);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }

  // Initialize Tables and seed data
  initSchemaAndSeed(dbInstance);
  saveDatabase(dbInstance);

  return dbInstance;
}

export function saveDatabase(db: Database = dbInstance!) {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Failed to save database to disk:', err);
  }
}

function initSchemaAndSeed(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS planets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      planet_type TEXT,
      description TEXT,
      distance_from_earth TEXT,
      travel_time TEXT,
      temperature TEXT,
      gravity TEXT,
      atmosphere TEXT,
      mission_duration TEXT,
      price REAL,
      image_url TEXT,
      tagline TEXT,
      featured_highlight TEXT,
      available INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      features TEXT
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_reference TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      planet_id INTEGER NOT NULL,
      package_id INTEGER,
      travelers INTEGER NOT NULL,
      departure_date TEXT,
      total_amount REAL,
      booking_status TEXT DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (planet_id) REFERENCES planets(id),
      FOREIGN KEY (package_id) REFERENCES packages(id)
    );

    CREATE TABLE IF NOT EXISTS passengers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      full_name TEXT,
      email TEXT,
      phone TEXT,
      date_of_birth TEXT,
      passport_number TEXT,
      emergency_contact TEXT,
      FOREIGN KEY (booking_id) REFERENCES bookings(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      transaction_id TEXT UNIQUE,
      amount REAL,
      payment_method TEXT,
      card_last_four TEXT,
      payment_status TEXT,
      payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      sender_name TEXT,
      email TEXT,
      subject TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      mission TEXT,
      rating INTEGER,
      quote TEXT,
      avatar_url TEXT,
      date TEXT
    );
  `);

  // Seed default planets if table is empty
  const countStmt = db.prepare('SELECT count(*) as count FROM planets');
  countStmt.step();
  const count = (countStmt.getAsObject() as { count: number }).count;
  countStmt.free();

  if (count === 0) {
    console.log('Seeding initial planet, package, and user data into SQL database...');

    // Seed Demo User
    const salt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('space2026', salt);
    db.run(
      `INSERT INTO users (full_name, email, password, phone) VALUES (?, ?, ?, ?)`,
      ['Commander Alex Mercer', 'alex.mercer@spaced.orbit', demoPasswordHash, '+1 800-555-ORBIT']
    );

    // Seed Packages
    const packages = [
      {
        name: 'ORBIT',
        description: 'Sub-orbital transfer, standard atmospheric pressure suit, and orbital station lodging.',
        price: 500000,
        features: JSON.stringify([
          'Standard EVA Bio-Suit 1.0',
          'Shared Habitation Pod',
          'Standard Nutritional Rations',
          'Sub-Orbital Training (3 Days)',
          'Pre-Flight Telemetry Briefing'
        ])
      },
      {
        name: 'EXPLORER',
        description: 'Surface expedition rover access, Bio-Suit 2.0 with HUD telemetry, and scientific guide.',
        price: 1200000,
        features: JSON.stringify([
          'Upgraded Bio-Suit 2.0 with HUD Retinal Controls',
          'Private Pressurized Hab Suite',
          'Guided Excursion to Key Geologic Formations',
          'Continuous Health & Radiation Monitoring',
          'Hyper-Spectral Photography Pass'
        ])
      },
      {
        name: 'GALACTIC',
        description: 'Ultra-luxury observatory suite, private mission specialist, zero-G dining, VIP launch queue.',
        price: 2500000,
        features: JSON.stringify([
          'Custom Fitted Quantum Bio-Suit 3.0',
          'Panoramic Observation Penthouse Hab',
          'Private Expedition Commander & Planetary Pilot',
          'Zero-G Molecular Gastronomy Dining',
          'Priority Launch Bay & Spacecraft Teleportation Pod'
        ])
      }
    ];

    for (const pkg of packages) {
      db.run(
        `INSERT INTO packages (name, description, price, features) VALUES (?, ?, ?, ?)`,
        [pkg.name, pkg.description, pkg.price, pkg.features]
      );
    }

    // Seed Planets
    const planets = [
      {
        name: 'MARS',
        planet_type: 'TERRESTRIAL',
        description: 'Experience the awe of the Red Planet. Visit the vast canyons of Valles Marineris, hike the slopes of Olympus Mons, and witness stunning blue sunsets from the comfort of our pressurized luxury habs.',
        distance_from_earth: '225M KM',
        travel_time: '3 MONTHS',
        temperature: '-60°C',
        gravity: '0.38 G',
        atmosphere: '95.3% CO2, 2.7% N2',
        mission_duration: '90 DAYS',
        price: 1850000,
        image_url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
        tagline: 'The Crimson Frontier & Olympus Mons Excursions',
        featured_highlight: 'Valles Marineris Sunset Walk'
      },
      {
        name: 'MOON',
        planet_type: 'LUNAR SATELLITE',
        description: 'A swift weekend orbital retreat. Traverse the historical Apollo landing coordinates, experience true 1/6th gravity moon-jumping, and gaze upon the majestic Earthrise from the Sea of Tranquility observatory.',
        distance_from_earth: '384,400 KM',
        travel_time: '3 DAYS',
        temperature: '-130°C TO 120°C',
        gravity: '0.16 G',
        atmosphere: 'Exosphere / Trace Helium',
        mission_duration: '7 DAYS',
        price: 650000,
        image_url: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=1200&q=80',
        tagline: 'Earthrise Luxury Retreat & Low-G Spas',
        featured_highlight: 'Sea of Tranquility Earthrise Lounge'
      },
      {
        name: 'EUROPA',
        planet_type: 'OCEANIC MOON',
        description: 'Descend through kilometers of crystal ice to witness the alien luminescence of Jupiter’s tidal ocean. Experience deep-trench hydrothermal hot springs shielded by thick ice caps.',
        distance_from_earth: '628M KM',
        travel_time: '14 MONTHS',
        temperature: '-160°C',
        gravity: '0.134 G',
        atmosphere: 'Trace Molecular Oxygen',
        mission_duration: '180 DAYS',
        price: 3400000,
        image_url: 'https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?auto=format&fit=crop&w=1200&q=80',
        tagline: 'Sub-Surface Cryo-Ocean Submersibles',
        featured_highlight: 'Deep-Hydrothermal Bioluminescence Dive'
      },
      {
        name: 'TITAN',
        planet_type: 'HYDROCARBON MOON',
        description: 'Fly with human-powered wings through Titan’s dense nitrogen atmosphere. Cruise across methane lakes aboard our climate-sealed yachting cruisers in Saturn’s amber glow.',
        distance_from_earth: '1.4B KM',
        travel_time: '2.5 YEARS',
        temperature: '-179°C',
        gravity: '0.14 G',
        atmosphere: '98% Nitrogen, 1.4% Methane',
        mission_duration: '240 DAYS',
        price: 4200000,
        image_url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
        tagline: 'Winged Gliding & Liquid Methane Sailing',
        featured_highlight: 'Kraken Mare Sunset Cruise'
      },
      {
        name: 'VENUS',
        planet_type: 'CLOUD METROPOLIS',
        description: 'Soar in tethered aerostat cloud cities 50 kilometers above the scorched surface, where atmospheric temperature and pressure mirror Earth’s Mediterranean coastline.',
        distance_from_earth: '41M KM',
        travel_time: '4 MONTHS',
        temperature: '25°C (Upper Clouds)',
        gravity: '0.90 G',
        atmosphere: 'Sulfuric/CO2 (In-Hab Air Balanced)',
        mission_duration: '60 DAYS',
        price: 1950000,
        image_url: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&w=1200&q=80',
        tagline: 'Floating High-Atmosphere Resorts',
        featured_highlight: 'Aphrodite Terra Stratospheric Balcony'
      },
      {
        name: 'GANYMEDE',
        planet_type: 'MAGNETIC MOON',
        description: 'The solar system’s largest moon, guarded by its own natural magnetosphere. Experience massive ice canyons and Jupiter’s Great Red Spot looming across the velvet sky.',
        distance_from_earth: '628M KM',
        travel_time: '15 MONTHS',
        temperature: '-163°C',
        gravity: '0.146 G',
        atmosphere: 'Trace Ozone & Oxygen',
        mission_duration: '120 DAYS',
        price: 2800000,
        image_url: 'https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?auto=format&fit=crop&w=1200&q=80',
        tagline: 'Solar System Super-Moon Sanctuary',
        featured_highlight: 'Jupiter Horizon Observation Station'
      },
      {
        name: 'KEPLER-186F',
        planet_type: 'EXOPLANET HABITABLE',
        description: 'Our premier interstellar warp expedition. Enter cryo-stasis or warp-transit to visit an Earth-sized world orbiting a warm red dwarf with crimson photosynthetic flora.',
        distance_from_earth: '582 LIGHT YRS',
        travel_time: 'WARP TRANSIT (6 WEEKS)',
        temperature: '15°C',
        gravity: '1.05 G',
        atmosphere: 'Nitrogen-Oxygen Rich',
        mission_duration: '365 DAYS',
        price: 9800000,
        image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        tagline: 'Interstellar Exoplanet Garden World',
        featured_highlight: 'Ruby Forest Canopy Expedition'
      },
      {
        name: 'PROXIMA B',
        planet_type: 'EXOPLANET EXPEDITION',
        description: 'Travel to our closest stellar neighbor in the Alpha Centauri system. Witness triple-star sunrises over rugged tidally locked coastal frontiers.',
        distance_from_earth: '4.24 LIGHT YRS',
        travel_time: 'WARP TRANSIT (2 WEEKS)',
        temperature: '-39°C TO 30°C',
        gravity: '1.1 G',
        atmosphere: 'Dense Protective Magnetosphere',
        mission_duration: '180 DAYS',
        price: 8500000,
        image_url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
        tagline: 'Alpha Centauri Multi-Stellar Gateway',
        featured_highlight: 'Twilight Ridge Triple Sunrise'
      }
    ];

    for (const p of planets) {
      db.run(
        `INSERT INTO planets (name, planet_type, description, distance_from_earth, travel_time, temperature, gravity, atmosphere, mission_duration, price, image_url, tagline, featured_highlight, available)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          p.name,
          p.planet_type,
          p.description,
          p.distance_from_earth,
          p.travel_time,
          p.temperature,
          p.gravity,
          p.atmosphere,
          p.mission_duration,
          p.price,
          p.image_url,
          p.tagline,
          p.featured_highlight
        ]
      );
    }

    // Seed Testimonials
    const testimonials = [
      {
        name: 'CAPT. SARAH JENKINS',
        mission: 'Mars Expedition • Sol 451',
        rating: 5,
        quote: 'The Bio Suit 2.0 exceeded all expectations during our Olympus Mons ascent. Incredible views, flawless life support. SPACED makes the impossible feel routine.',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        date: '14 Jan 2026'
      },
      {
        name: 'DR. ALEX CHEN',
        mission: 'Europa Abyss Flight • Orbit 12',
        rating: 5,
        quote: 'Luxury accommodations under kilometers of ice. The sub-surface ocean tours were breathtaking. Five stars for the cuisine alone!',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        date: '28 Feb 2026'
      },
      {
        name: 'ELENA ROSTOVA',
        mission: 'Lunar Odyssey • Orbit 091',
        rating: 5,
        quote: 'A perfect weekend getaway. Earthrise from the Sea of Tranquility is something everyone should experience once. Booking process was seamless.',
        avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        date: '05 Mar 2026'
      },
      {
        name: 'MARCUS VANCE',
        mission: 'Titan Methane Cruise • Sol 108',
        rating: 5,
        quote: 'Gliding across Saturn’s amber sky with wings in Titan’s dense atmosphere was the greatest moment of my life. Professional crew and top-tier safety.',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        date: '12 Apr 2026'
      }
    ];

    for (const t of testimonials) {
      db.run(
        `INSERT INTO testimonials (name, mission, rating, quote, avatar_url, date) VALUES (?, ?, ?, ?, ?, ?)`,
        [t.name, t.mission, t.rating, t.quote, t.avatar_url, t.date]
      );
    }

    // Seed Sample Booking for demo user
    db.run(
      `INSERT INTO bookings (booking_reference, user_id, planet_id, package_id, travelers, departure_date, total_amount, booking_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['SPC-MARS-82931', 1, 1, 2, 2, '2027-03-12', 3050000, 'CONFIRMED']
    );

    // Seed Passengers for this booking
    db.run(
      `INSERT INTO passengers (booking_id, full_name, email, phone, date_of_birth, passport_number, emergency_contact)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [1, 'Commander Alex Mercer', 'alex.mercer@spaced.orbit', '+1 800-555-ORBIT', '1992-06-15', 'SPC-EXP-99201', 'Elena Mercer (+1 800-555-9999)']
    );
    db.run(
      `INSERT INTO passengers (booking_id, full_name, email, phone, date_of_birth, passport_number, emergency_contact)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [1, 'Dr. Samantha Reed', 'samantha.reed@astro.edu', '+1 800-555-ASTRO', '1995-11-22', 'SPC-EXP-99202', 'James Reed (+1 800-555-8888)']
    );

    // Seed Payment for this booking
    db.run(
      `INSERT INTO payments (booking_id, transaction_id, amount, payment_method, card_last_four, payment_status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [1, 'SPC-2026-839271', 3050000, 'DEMO_CREDIT_CARD', '1111', 'COMPLETED']
    );
  }
}
