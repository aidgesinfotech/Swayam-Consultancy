-- ============================================================
-- Swayam Consultancy Investment Tracking - DB Migration
-- Run this SQL on your MySQL database
-- ============================================================

-- Admin users (for ADMIN panel login)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  mobile VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  token TEXT,
  isActive TINYINT(1) DEFAULT 1,
  created_at DATETIME,
  updated_at DATETIME
);

-- Default admin user (email: admin@swayam.com | password: Admin@123)
INSERT IGNORE INTO users (name, email, mobile, password, isActive, created_at, updated_at)
VALUES ('Super Admin', 'admin@swayam.com', '9999999999', 'Admin@123', 1, NOW(), NOW());

-- Site configuration
CREATE TABLE IF NOT EXISTS siteconfig (
  id INT AUTO_INCREMENT PRIMARY KEY,
  siteName VARCHAR(255) DEFAULT 'Swayam Consultancy',
  clientUrl VARCHAR(255),
  logo TEXT,
  whiteLogo TEXT,
  icon TEXT,
  instagramURL VARCHAR(255),
  facebookURL VARCHAR(255),
  twitterURL VARCHAR(255),
  linkedInURL VARCHAR(255),
  youtubeURL VARCHAR(255),
  mobile VARCHAR(20),
  email VARCHAR(255),
  primaryColor VARCHAR(20) DEFAULT '#2563eb',
  theme VARCHAR(50) DEFAULT 'light',
  created_at DATETIME,
  updated_at DATETIME
);

INSERT IGNORE INTO siteconfig (id, siteName, primaryColor, created_at, updated_at)
VALUES (1, 'Swayam Consultancy', '#2563eb', NOW(), NOW());

-- Clients (investors/users)
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  mobile VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  token TEXT,
  isActive TINYINT(1) DEFAULT 1,
  created_at DATETIME,
  updated_at DATETIME
);

-- Stocks master
CREATE TABLE IF NOT EXISTS stocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(50) NOT NULL UNIQUE,
  lot_size INT DEFAULT 1,
  current_price DECIMAL(12,2) DEFAULT 0,
  sector VARCHAR(100),
  isActive TINYINT(1) DEFAULT 1,
  created_at DATETIME,
  updated_at DATETIME
);

-- Transactions (buy/sell entries)
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  stock_id INT NOT NULL,
  type ENUM('buy','sell') NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  lots INT,
  buy_price DECIMAL(12,2),
  sell_price DECIMAL(12,2),
  proof_image TEXT,
  notes TEXT,
  status ENUM('open','closed') DEFAULT 'open',
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  target_type ENUM('all','specific') DEFAULT 'all',
  target_client_id INT,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (target_client_id) REFERENCES clients(id) ON DELETE SET NULL
);

-- Notification read tracking
CREATE TABLE IF NOT EXISTS notification_reads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  notification_id INT NOT NULL,
  client_id INT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at DATETIME,
  UNIQUE KEY unique_read (notification_id, client_id),
  FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- ============================================================
-- If siteconfig table already exists, add primaryColor column
-- (safe to run even if column already exists)
-- ============================================================
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS primaryColor VARCHAR(20) DEFAULT '#2563eb';
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS clientUrl VARCHAR(255);
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS instagramURL VARCHAR(255);
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS facebookURL VARCHAR(255);
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS twitterURL VARCHAR(255);
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS linkedInURL VARCHAR(255);
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS youtubeURL VARCHAR(255);
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS mobile VARCHAR(20);
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- ============================================================
-- CMS / Login Page columns
-- ============================================================
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS loginHeading VARCHAR(255) DEFAULT 'Track. Analyse. Grow.';
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS loginSubheading TEXT DEFAULT 'Your complete investment tracking platform.';
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS loginBgColor VARCHAR(20) DEFAULT '';
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS loginFeature1 VARCHAR(100) DEFAULT 'Real-time Portfolio Tracking';
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS loginFeature2 VARCHAR(100) DEFAULT 'Auto P&L Calculation';
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS loginFeature3 VARCHAR(100) DEFAULT 'PDF Reports';
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS enableRegister TINYINT(1) DEFAULT 1;

-- ============================================================
-- Login Page CMS (separate table — only login page content)
-- ============================================================
CREATE TABLE IF NOT EXISTS login_page_cms (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  heading       VARCHAR(255)  DEFAULT 'Track. Analyse. Grow.',
  subheading    TEXT,
  feature1      VARCHAR(150)  DEFAULT 'Real-time Portfolio Tracking',
  feature2      VARCHAR(150)  DEFAULT 'Auto P&L Calculation',
  feature3      VARCHAR(150)  DEFAULT 'PDF Reports',
  logo          TEXT,
  bg_color      VARCHAR(20)   DEFAULT NULL,
  enable_register TINYINT(1)  DEFAULT 1,
  created_at    DATETIME,
  updated_at    DATETIME
);

-- Seed default row (id = 1, always single row)
INSERT IGNORE INTO login_page_cms
  (id, heading, subheading, feature1, feature2, feature3, enable_register, created_at, updated_at)
VALUES (
  1,
  'Track. Analyse. Grow.',
  'Your complete investment tracking platform. Monitor stocks, calculate P&L, and stay on top of your portfolio — all in one place.',
  'Real-time Portfolio Tracking',
  'Auto P&L Calculation',
  'PDF Reports',
  1,
  NOW(), NOW()
);

-- ============================================================
-- Clean up: remove CMS columns from siteconfig (now in login_page_cms)
-- Safe to run — IF EXISTS prevents errors if columns don't exist
-- ============================================================
ALTER TABLE siteconfig DROP COLUMN IF EXISTS loginHeading;
ALTER TABLE siteconfig DROP COLUMN IF EXISTS loginSubheading;
ALTER TABLE siteconfig DROP COLUMN IF EXISTS loginBgColor;
ALTER TABLE siteconfig DROP COLUMN IF EXISTS loginFeature1;
ALTER TABLE siteconfig DROP COLUMN IF EXISTS loginFeature2;
ALTER TABLE siteconfig DROP COLUMN IF EXISTS loginFeature3;
ALTER TABLE siteconfig DROP COLUMN IF EXISTS enableRegister;

-- ============================================================
-- Trade Calls System
-- ============================================================

-- trade_calls: Admin posts a call recommendation
CREATE TABLE IF NOT EXISTS trade_calls (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  stock_id        INT NOT NULL,
  call_type       ENUM('BUY','SELL') NOT NULL DEFAULT 'BUY',
  recommended_price DECIMAL(12,2) NOT NULL,
  target_price    DECIMAL(12,2),
  stop_loss       DECIMAL(12,2),
  lots            INT DEFAULT 1,
  description     TEXT,
  is_active       TINYINT(1) DEFAULT 1,   -- 1=live/bookable, 0=expired
  created_at      DATETIME,
  updated_at      DATETIME,
  FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
);

-- trade_bookings: Client books a trade against a call
CREATE TABLE IF NOT EXISTS trade_bookings (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  call_id         INT NOT NULL,
  client_id       INT NOT NULL,
  platform        VARCHAR(100),            -- platform used to buy
  booking_price   DECIMAL(12,2) NOT NULL,  -- price at which client bought
  quantity        INT NOT NULL DEFAULT 1,
  lots            INT,
  entry_screenshot TEXT,                   -- optional proof screenshot
  status          ENUM('open','closed') DEFAULT 'open',
  closing_price   DECIMAL(12,2),           -- filled when client closes
  exit_screenshot TEXT,                    -- optional closing proof
  pnl             DECIMAL(12,2),           -- calculated on close
  notes           TEXT,
  created_at      DATETIME,
  updated_at      DATETIME,
  FOREIGN KEY (call_id)   REFERENCES trade_calls(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id)     ON DELETE CASCADE
);

-- ============================================================
-- Remove current_price from stocks (price comes from trade_calls)
-- ============================================================
ALTER TABLE stocks DROP COLUMN IF EXISTS current_price;
