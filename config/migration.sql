-- ============================================================
-- Swayam Consultancy Investment Tracking — DB Migration
-- Safe to run multiple times (IF NOT EXISTS / IF EXISTS guards)
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ── Admin users ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  mobile     VARCHAR(20),
  password   VARCHAR(255) NOT NULL,
  token      TEXT,
  isActive   TINYINT(1) DEFAULT 1,
  created_at DATETIME,
  updated_at DATETIME
);

INSERT IGNORE INTO users (name, email, mobile, password, isActive, created_at, updated_at)
VALUES ('Super Admin', 'admin@swayam.com', '9999999999', 'Admin@123', 1, NOW(), NOW());

-- ── Site configuration ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS siteconfig (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  siteName     VARCHAR(255) DEFAULT 'Swayam Consultancy',
  clientUrl    VARCHAR(255),
  logo         TEXT,
  whiteLogo    TEXT,
  icon         TEXT,
  instagramURL VARCHAR(255),
  facebookURL  VARCHAR(255),
  twitterURL   VARCHAR(255),
  linkedInURL  VARCHAR(255),
  youtubeURL   VARCHAR(255),
  mobile       VARCHAR(20),
  email        VARCHAR(255),
  primaryColor VARCHAR(20) DEFAULT '#2563eb',
  theme        VARCHAR(50) DEFAULT 'light',
  created_at   DATETIME,
  updated_at   DATETIME
);

INSERT IGNORE INTO siteconfig (id, siteName, primaryColor, created_at, updated_at)
VALUES (1, 'Swayam Consultancy', '#2563eb', NOW(), NOW());

-- ── Login Page CMS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS login_page_cms (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  heading         VARCHAR(255) DEFAULT 'Track. Analyse. Grow.',
  subheading      TEXT,
  feature1        VARCHAR(150) DEFAULT 'Real-time Portfolio Tracking',
  feature2        VARCHAR(150) DEFAULT 'Auto P&L Calculation',
  feature3        VARCHAR(150) DEFAULT 'PDF Reports',
  logo            TEXT,
  bg_color        VARCHAR(20)  DEFAULT NULL,
  enable_register TINYINT(1)   DEFAULT 1,
  created_at      DATETIME,
  updated_at      DATETIME
);

INSERT IGNORE INTO login_page_cms
  (id, heading, subheading, feature1, feature2, feature3, enable_register, created_at, updated_at)
VALUES (1,
  'Track. Analyse. Grow.',
  'Your complete investment tracking platform. Monitor stocks, calculate P&L, and stay on top of your portfolio — all in one place.',
  'Real-time Portfolio Tracking', 'Auto P&L Calculation', 'PDF Reports',
  1, NOW(), NOW()
);

-- ── Clients ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  mobile     VARCHAR(20),
  password   VARCHAR(255) NOT NULL,
  token      TEXT,
  isActive   TINYINT(1) DEFAULT 1,
  created_at DATETIME,
  updated_at DATETIME
);

-- ── Stocks ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stocks (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  lot_size     INT          DEFAULT 1,
  qty          INT          DEFAULT 1,
  expiry_date  DATE         DEFAULT NULL,
  strike_price DECIMAL(12,2) DEFAULT NULL,
  isActive     TINYINT(1)   DEFAULT 1,
  created_at   DATETIME,
  updated_at   DATETIME
);

-- ── Trade Calls ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trade_calls (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  stock_id          INT NOT NULL,
  call_type         ENUM('BUY','SELL') NOT NULL DEFAULT 'BUY',
  recommended_price DECIMAL(12,2) NOT NULL,
  target_price      DECIMAL(12,2),
  lots              INT DEFAULT 1,
  description       TEXT,
  is_active         TINYINT(1) DEFAULT 1,
  created_at        DATETIME,
  updated_at        DATETIME,
  FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
);

-- ── Trade Bookings ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trade_bookings (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  call_id          INT NOT NULL,
  client_id        INT NOT NULL,
  platform         VARCHAR(100),
  booking_price    DECIMAL(12,2) NOT NULL,
  quantity         INT NOT NULL DEFAULT 1,
  lots             INT,
  entry_screenshot TEXT,
  status           ENUM('open','closed') DEFAULT 'open',
  closing_price    DECIMAL(12,2),
  exit_screenshot  TEXT,
  pnl              DECIMAL(12,2),
  notes            TEXT,
  created_at       DATETIME,
  updated_at       DATETIME,
  FOREIGN KEY (call_id)   REFERENCES trade_calls(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id)     ON DELETE CASCADE
);

-- ── Transactions ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  client_id   INT NOT NULL,
  stock_id    INT NOT NULL,
  type        ENUM('buy','sell') NOT NULL,
  quantity    INT NOT NULL DEFAULT 1,
  lots        INT,
  buy_price   DECIMAL(12,2),
  sell_price  DECIMAL(12,2),
  proof_image TEXT,
  notes       TEXT,
  status      ENUM('open','closed') DEFAULT 'open',
  created_at  DATETIME,
  updated_at  DATETIME,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (stock_id)  REFERENCES stocks(id)  ON DELETE CASCADE
);

-- ── Notifications ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  title            VARCHAR(255) NOT NULL,
  message          TEXT NOT NULL,
  target_type      ENUM('all','specific') DEFAULT 'all',
  target_client_id INT,
  created_at       DATETIME,
  updated_at       DATETIME,
  FOREIGN KEY (target_client_id) REFERENCES clients(id) ON DELETE SET NULL
);

-- ── Notification reads ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notification_reads (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  notification_id INT NOT NULL,
  client_id       INT NOT NULL,
  is_read         TINYINT(1) DEFAULT 0,
  created_at      DATETIME,
  UNIQUE KEY unique_read (notification_id, client_id),
  FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id)       REFERENCES clients(id)       ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- ALTER statements — safe for existing databases
-- Adds missing columns / drops removed ones
-- ============================================================

-- stocks: add new columns if missing, drop old ones
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS qty          INT           DEFAULT 1    AFTER lot_size;
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS expiry_date  DATE          DEFAULT NULL AFTER qty;
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS strike_price DECIMAL(12,2) DEFAULT NULL AFTER expiry_date;
ALTER TABLE stocks DROP COLUMN IF EXISTS symbol;
ALTER TABLE stocks DROP COLUMN IF EXISTS sector;
ALTER TABLE stocks DROP COLUMN IF EXISTS current_price;

-- trade_calls: drop stop_loss (removed from app)
ALTER TABLE trade_calls DROP COLUMN IF EXISTS stop_loss;

-- siteconfig: add missing columns
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS clientUrl    VARCHAR(255) AFTER siteName;
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS whiteLogo    TEXT         AFTER logo;
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS icon         TEXT         AFTER whiteLogo;
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS instagramURL VARCHAR(255) AFTER icon;
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS facebookURL  VARCHAR(255) AFTER instagramURL;
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS twitterURL   VARCHAR(255) AFTER facebookURL;
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS linkedInURL  VARCHAR(255) AFTER twitterURL;
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS youtubeURL   VARCHAR(255) AFTER linkedInURL;
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS mobile       VARCHAR(20)  AFTER youtubeURL;
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS email        VARCHAR(255) AFTER mobile;
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS primaryColor VARCHAR(20)  DEFAULT '#2563eb' AFTER email;
ALTER TABLE siteconfig ADD COLUMN IF NOT EXISTS theme        VARCHAR(50)  DEFAULT 'light'   AFTER primaryColor;

-- siteconfig: drop old CMS columns (moved to login_page_cms table)
ALTER TABLE siteconfig DROP COLUMN IF EXISTS loginHeading;
ALTER TABLE siteconfig DROP COLUMN IF EXISTS loginSubheading;
ALTER TABLE siteconfig DROP COLUMN IF EXISTS loginBgColor;
ALTER TABLE siteconfig DROP COLUMN IF EXISTS loginFeature1;
ALTER TABLE siteconfig DROP COLUMN IF EXISTS loginFeature2;
ALTER TABLE siteconfig DROP COLUMN IF EXISTS loginFeature3;
ALTER TABLE siteconfig DROP COLUMN IF EXISTS enableRegister;

-- ============================================================
-- Done. Tables created / updated successfully.
-- ============================================================
