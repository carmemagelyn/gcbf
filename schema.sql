-- GCBF Church Management Database Schema
-- SQLite Database for Cloudflare D1

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  userType TEXT NOT NULL CHECK(userType IN ('admin', 'pastor', 'member')),
  phone TEXT,
  joinDate TEXT NOT NULL,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- Prayers table
CREATE TABLE IF NOT EXISTS prayers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  request TEXT NOT NULL,
  visibility TEXT NOT NULL CHECK(visibility IN ('public', 'personal', 'pastor')),
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'answered')),
  approved BOOLEAN DEFAULT 0,
  approvedBy TEXT,
  approvedAt TEXT,
  prayerCount INTEGER DEFAULT 0,
  dateRequested TEXT NOT NULL,
  dateAnswered TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Prayer interactions (who prayed for what)
CREATE TABLE IF NOT EXISTS prayer_interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prayerId INTEGER NOT NULL,
  userId INTEGER NOT NULL,
  prayedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (prayerId) REFERENCES prayers(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(prayerId, userId)
);

-- Newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  excerpt TEXT,
  issueNumber INTEGER NOT NULL,
  volume INTEGER DEFAULT 1,
  pageCount INTEGER,
  publishedBy TEXT NOT NULL,
  coverImage TEXT,
  downloadUrl TEXT NOT NULL,
  highlights TEXT, -- JSON array stored as text
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- Ministry Reports table
CREATE TABLE IF NOT EXISTS ministry_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  leader TEXT,
  budget REAL DEFAULT 0,
  spent REAL DEFAULT 0,
  participants INTEGER DEFAULT 0,
  description TEXT,
  notes TEXT,
  active BOOLEAN DEFAULT 1,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- Attendance tracking
CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ministryId INTEGER NOT NULL,
  date TEXT NOT NULL,
  count INTEGER NOT NULL,
  notes TEXT,
  recordedBy TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (ministryId) REFERENCES ministry_reports(id) ON DELETE CASCADE
);

-- Income tracking
CREATE TABLE IF NOT EXISTS income (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  amount REAL NOT NULL,
  source TEXT,
  description TEXT,
  notes TEXT,
  recordedBy TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- Expenses tracking
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  amount REAL NOT NULL,
  description TEXT,
  notes TEXT,
  recordedBy TEXT,
  receiptUrl TEXT,
  approved BOOLEAN DEFAULT 0,
  approvedBy TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- Giving/Pledges table
CREATE TABLE IF NOT EXISTS pledges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  amount REAL NOT NULL,
  frequency TEXT NOT NULL CHECK(frequency IN ('one-time', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly')),
  startDate TEXT NOT NULL,
  endDate TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'cancelled')),
  notes TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Pledge payments
CREATE TABLE IF NOT EXISTS pledge_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pledgeId INTEGER NOT NULL,
  userId INTEGER NOT NULL,
  amount REAL NOT NULL,
  paymentDate TEXT NOT NULL,
  paymentMethod TEXT NOT NULL CHECK(paymentMethod IN ('cash', 'check', 'bank-transfer', 'gcash', 'online')),
  referenceNumber TEXT,
  verificationStatus TEXT DEFAULT 'pending' CHECK(verificationStatus IN ('pending', 'approved', 'rejected')),
  verifiedBy TEXT,
  verifiedDate TEXT,
  receiptUrl TEXT,
  notes TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (pledgeId) REFERENCES pledges(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Bible reading tracking
CREATE TABLE IF NOT EXISTS bible_reading (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  date TEXT NOT NULL,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  notes TEXT,
  completed BOOLEAN DEFAULT 1,
  createdAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(userId, date, book, chapter)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_prayers_user ON prayers(userId);
CREATE INDEX IF NOT EXISTS idx_prayers_status ON prayers(status);
CREATE INDEX IF NOT EXISTS idx_prayers_visibility ON prayers(visibility);
CREATE INDEX IF NOT EXISTS idx_newsletters_date ON newsletters(date DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_ministry ON attendance(ministryId);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date DESC);
CREATE INDEX IF NOT EXISTS idx_income_date ON income(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_pledges_user ON pledges(userId);
CREATE INDEX IF NOT EXISTS idx_pledge_payments_pledge ON pledge_payments(pledgeId);
CREATE INDEX IF NOT EXISTS idx_bible_reading_user ON bible_reading(userId);

-- Insert demo users (passwords should be hashed in production)
INSERT INTO users (email, password, name, userType, joinDate) VALUES
('pastor@gcbf.com.ph', 'admin123', 'Pastor John Louie Berdejo', 'pastor', '2020-06-01'),
('admin@gcbf.com.ph', 'admin2024', 'Church Administrator', 'admin', '2023-01-01');

-- Insert sample prayer
INSERT INTO prayers (userId, category, title, request, visibility, status, approved, approvedBy, approvedAt, dateRequested) VALUES
(1, 'Missions', 'Mission Trip Safety', 'Our youth mission team is traveling to Guatemala next week. Please pray for their safety and for hearts to be touched.', 'public', 'active', 1, 'Church Administrator', datetime('now'), date('now'));
