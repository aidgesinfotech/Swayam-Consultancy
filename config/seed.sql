-- ============================================================
-- Swayam Consultancy — Full Demo Seed Data
-- Run AFTER migration.sql
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ── Clients (25 investors) ────────────────────────────────────────────────────
INSERT INTO clients (id, name, email, mobile, password, isActive, created_at, updated_at) VALUES
(1,  'Rajesh Sharma',     'rajesh.sharma@gmail.com',    '9876543210', 'Pass@123', 1, '2025-01-05 09:15:00', '2025-01-05 09:15:00'),
(2,  'Priya Patel',       'priya.patel@gmail.com',      '9823456789', 'Pass@123', 1, '2025-01-08 10:30:00', '2025-01-08 10:30:00'),
(3,  'Amit Verma',        'amit.verma@yahoo.com',       '9712345678', 'Pass@123', 1, '2025-01-10 11:00:00', '2025-01-10 11:00:00'),
(4,  'Sunita Gupta',      'sunita.gupta@gmail.com',     '9634567890', 'Pass@123', 1, '2025-01-12 14:20:00', '2025-01-12 14:20:00'),
(5,  'Vikram Singh',      'vikram.singh@hotmail.com',   '9556789012', 'Pass@123', 1, '2025-01-15 09:45:00', '2025-01-15 09:45:00'),
(6,  'Meena Joshi',       'meena.joshi@gmail.com',      '9478901234', 'Pass@123', 1, '2025-01-18 16:00:00', '2025-01-18 16:00:00'),
(7,  'Deepak Nair',       'deepak.nair@gmail.com',      '9390123456', 'Pass@123', 1, '2025-01-20 10:15:00', '2025-01-20 10:15:00'),
(8,  'Kavita Reddy',      'kavita.reddy@gmail.com',     '9212345678', 'Pass@123', 1, '2025-01-22 11:30:00', '2025-01-22 11:30:00'),
(9,  'Suresh Mehta',      'suresh.mehta@gmail.com',     '9134567890', 'Pass@123', 1, '2025-01-25 13:00:00', '2025-01-25 13:00:00'),
(10, 'Anita Desai',       'anita.desai@gmail.com',      '9056789012', 'Pass@123', 1, '2025-01-28 15:45:00', '2025-01-28 15:45:00'),
(11, 'Rohit Kapoor',      'rohit.kapoor@gmail.com',     '8978901234', 'Pass@123', 1, '2025-02-01 09:00:00', '2025-02-01 09:00:00'),
(12, 'Pooja Agarwal',     'pooja.agarwal@gmail.com',    '8890123456', 'Pass@123', 1, '2025-02-03 10:30:00', '2025-02-03 10:30:00'),
(13, 'Manoj Kumar',       'manoj.kumar@gmail.com',      '8812345678', 'Pass@123', 1, '2025-02-05 11:15:00', '2025-02-05 11:15:00'),
(14, 'Rekha Iyer',        'rekha.iyer@gmail.com',       '8734567890', 'Pass@123', 1, '2025-02-08 14:00:00', '2025-02-08 14:00:00'),
(15, 'Sanjay Bhatt',      'sanjay.bhatt@gmail.com',     '8656789012', 'Pass@123', 1, '2025-02-10 16:30:00', '2025-02-10 16:30:00'),
(16, 'Neha Saxena',       'neha.saxena@gmail.com',      '8578901234', 'Pass@123', 1, '2025-02-12 09:45:00', '2025-02-12 09:45:00'),
(17, 'Arun Pillai',       'arun.pillai@gmail.com',      '8490123456', 'Pass@123', 1, '2025-02-15 11:00:00', '2025-02-15 11:00:00'),
(18, 'Shweta Mishra',     'shweta.mishra@gmail.com',    '8312345678', 'Pass@123', 1, '2025-02-18 13:30:00', '2025-02-18 13:30:00'),
(19, 'Kiran Rao',         'kiran.rao@gmail.com',        '8234567890', 'Pass@123', 1, '2025-02-20 15:00:00', '2025-02-20 15:00:00'),
(20, 'Tarun Malhotra',    'tarun.malhotra@gmail.com',   '8156789012', 'Pass@123', 1, '2025-02-22 10:15:00', '2025-02-22 10:15:00'),
(21, 'Divya Chaudhary',   'divya.chaudhary@gmail.com',  '8078901234', 'Pass@123', 1, '2025-02-25 09:30:00', '2025-02-25 09:30:00'),
(22, 'Nitin Jain',        'nitin.jain@gmail.com',       '7990123456', 'Pass@123', 1, '2025-03-01 11:45:00', '2025-03-01 11:45:00'),
(23, 'Pallavi Tiwari',    'pallavi.tiwari@gmail.com',   '7912345678', 'Pass@123', 1, '2025-03-03 14:00:00', '2025-03-03 14:00:00'),
(24, 'Gaurav Pandey',     'gaurav.pandey@gmail.com',    '7834567890', 'Pass@123', 1, '2025-03-05 16:15:00', '2025-03-05 16:15:00'),
(25, 'Ritu Bansal',       'ritu.bansal@gmail.com',      '7756789012', 'Pass@123', 1, '2025-03-08 10:00:00', '2025-03-08 10:00:00');

-- ── Stocks (45 instruments — no symbol/sector/current_price) ─────────────────
INSERT INTO stocks (id, name, lot_size, qty, isActive, created_at, updated_at) VALUES
(1,  'Reliance Industries',         250,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(2,  'Tata Consultancy Services',   150,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(3,  'HDFC Bank',                   550,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(4,  'Infosys',                     300,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(5,  'ICICI Bank',                  700,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(6,  'Hindustan Unilever',          300,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(7,  'Bajaj Finance',               125,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(8,  'Wipro',                       1500, 1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(9,  'Maruti Suzuki',               100,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(10, 'Larsen & Toubro',             150,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(11, 'Axis Bank',                   1200, 1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(12, 'Kotak Mahindra Bank',         400,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(13, 'State Bank of India',         1500, 1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(14, 'Tata Motors',                 1350, 1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(15, 'Sun Pharmaceutical',          700,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(16, 'Adani Ports',                 1250, 1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(17, 'Titan Company',               375,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(18, 'Asian Paints',                200,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(19, 'HCL Technologies',            700,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(20, 'Nestle India',                50,   1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(21, 'Power Grid Corporation',      3000, 1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(22, 'NTPC',                        3750, 1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(23, 'Bajaj Auto',                  75,   1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(24, 'Tech Mahindra',               600,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(25, 'UltraTech Cement',            100,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(26, 'Grasim Industries',           375,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(27, 'IndusInd Bank',               1000, 1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(28, 'Cipla',                       650,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(29, 'Eicher Motors',               175,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(30, 'Divi Laboratories',           200,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(31, 'Tata Steel',                  5500, 1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(32, 'JSW Steel',                   1350, 1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(33, 'Hindalco Industries',         2150, 1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(34, 'Britannia Industries',        200,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(35, 'Dr Reddys Laboratories',      125,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(36, 'Shree Cement',                25,   1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(37, 'Pidilite Industries',         250,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(38, 'Havells India',               500,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(39, 'Berger Paints',               1100, 1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(40, 'Muthoot Finance',             750,  1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(41, 'Godrej Consumer Products',    1000, 1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(42, 'Dabur India',                 2500, 1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(43, 'Marico',                      1300, 1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(44, 'Voltas',                      1000, 1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
(45, 'Tata Consumer Products',      1100, 1, 1, '2025-01-01 08:00:00', '2025-01-01 08:00:00');

-- ── Trade Calls (15 calls — 10 active, 5 expired) ────────────────────────────
INSERT INTO trade_calls (id, stock_id, call_type, recommended_price, target_price, stop_loss, lots, description, is_active, created_at, updated_at) VALUES
(1,  1,  'BUY',  2450.00,  2650.00,  2350.00, 2, 'Reliance showing strong support at 2450. Q3 results expected to be strong. Good risk-reward setup.', 1, '2025-03-10 09:30:00', '2025-03-10 09:30:00'),
(2,  2,  'BUY',  3820.00,  4100.00,  3700.00, 1, 'TCS consolidating near 52-week support. IT sector recovery expected. Hold for 2-3 weeks.', 1, '2025-03-12 10:00:00', '2025-03-12 10:00:00'),
(3,  5,  'BUY',  1180.00,  1280.00,  1130.00, 3, 'ICICI Bank breakout above 1180 resistance. Banking sector momentum strong. Target 1280.', 1, '2025-03-15 09:45:00', '2025-03-15 09:45:00'),
(4,  14, 'BUY',  920.00,   1050.00,  870.00,  2, 'Tata Motors EV segment growing rapidly. JLR recovery on track. Accumulate at current levels.', 1, '2025-03-18 10:15:00', '2025-03-18 10:15:00'),
(5,  13, 'BUY',  780.00,   850.00,   745.00,  3, 'SBI strong fundamentals. NPA reduction visible. Budget allocation positive for PSU banks.', 1, '2025-03-20 09:30:00', '2025-03-20 09:30:00'),
(6,  15, 'BUY',  1620.00,  1780.00,  1560.00, 2, 'Sun Pharma US generics business improving. Specialty pipeline strong. Buy on dips.', 1, '2025-03-22 10:00:00', '2025-03-22 10:00:00'),
(7,  10, 'BUY',  3450.00,  3750.00,  3300.00, 1, 'L&T order book at all-time high. Infrastructure push by government. Strong buy.', 1, '2025-03-25 09:45:00', '2025-03-25 09:45:00'),
(8,  31, 'BUY',  145.00,   165.00,   135.00,  5, 'Tata Steel China demand recovery. Domestic steel prices stable. Good entry at 145.', 1, '2025-03-28 10:30:00', '2025-03-28 10:30:00'),
(9,  19, 'BUY',  1890.00,  2050.00,  1820.00, 2, 'HCL Tech strong deal wins. IT spending recovery in US market. Outperformer in sector.', 1, '2025-04-01 09:30:00', '2025-04-01 09:30:00'),
(10, 7,  'BUY',  6800.00,  7400.00,  6500.00, 1, 'Bajaj Finance credit growth strong. Asset quality stable. Premium valuation justified.', 1, '2025-04-03 10:00:00', '2025-04-03 10:00:00'),
(11, 4,  'BUY',  1520.00,  1680.00,  1460.00, 2, 'Infosys large deal momentum. Margin guidance maintained. Buy for medium term.', 0, '2025-02-01 09:30:00', '2025-02-28 15:30:00'),
(12, 9,  'BUY',  10800.00, 11500.00, 10400.00,1, 'Maruti new model launches driving volume growth. Rural demand recovery. Strong buy.', 0, '2025-02-05 10:00:00', '2025-03-05 15:00:00'),
(13, 17, 'BUY',  3200.00,  3500.00,  3050.00, 1, 'Titan jewellery segment strong. Wedding season demand. Premium brand moat intact.', 0, '2025-02-10 09:45:00', '2025-03-10 15:00:00'),
(14, 25, 'BUY',  10200.00, 11000.00, 9800.00, 1, 'UltraTech capacity expansion on track. Cement demand strong in infra push.', 0, '2025-02-15 10:15:00', '2025-03-15 15:00:00'),
(15, 3,  'SELL', 1680.00,  1580.00,  1730.00, 2, 'HDFC Bank near-term headwinds. Merger integration costs. Short-term sell opportunity.', 0, '2025-02-20 09:30:00', '2025-03-20 15:00:00');

-- ── Trade Bookings ────────────────────────────────────────────────────────────
INSERT INTO trade_bookings (id, call_id, client_id, platform, booking_price, quantity, lots, entry_screenshot, status, closing_price, exit_screenshot, pnl, notes, created_at, updated_at) VALUES
(1,  1, 1,  'Zerodha',   2455.00,  500,  2, NULL, 'open',   NULL,     NULL, NULL,      'Booked as per advisor call', '2025-03-10 10:15:00', '2025-03-10 10:15:00'),
(2,  1, 2,  'Groww',     2460.00,  500,  2, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-10 11:00:00', '2025-03-10 11:00:00'),
(3,  1, 3,  'Upstox',    2452.00,  500,  2, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-11 09:30:00', '2025-03-11 09:30:00'),
(4,  1, 4,  'Angel One', 2458.00,  500,  2, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-11 10:45:00', '2025-03-11 10:45:00'),
(5,  1, 5,  'Zerodha',   2450.00,  500,  2, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-12 09:15:00', '2025-03-12 09:15:00'),
(6,  2, 1,  'Zerodha',   3825.00,  150,  1, NULL, 'closed', 4050.00,  NULL, 33750.00,  'Good profit, exited at target', '2025-03-12 10:30:00', '2025-03-28 14:00:00'),
(7,  2, 6,  'Groww',     3830.00,  150,  1, NULL, 'closed', 4020.00,  NULL, 28500.00,  NULL,                         '2025-03-12 11:00:00', '2025-03-27 15:00:00'),
(8,  2, 7,  'Upstox',    3820.00,  150,  1, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-13 09:30:00', '2025-03-13 09:30:00'),
(9,  2, 8,  'Zerodha',   3835.00,  150,  1, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-13 10:00:00', '2025-03-13 10:00:00'),
(10, 3, 2,  'Groww',     1182.00,  2100, 3, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-15 10:00:00', '2025-03-15 10:00:00'),
(11, 3, 9,  'Zerodha',   1185.00,  2100, 3, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-15 10:30:00', '2025-03-15 10:30:00'),
(12, 3, 10, 'Angel One', 1180.00,  2100, 3, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-16 09:15:00', '2025-03-16 09:15:00'),
(13, 3, 11, 'Upstox',    1183.00,  2100, 3, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-16 10:00:00', '2025-03-16 10:00:00'),
(14, 4, 3,  'Zerodha',   922.00,   2700, 2, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-18 10:30:00', '2025-03-18 10:30:00'),
(15, 4, 12, 'Groww',     925.00,   2700, 2, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-18 11:00:00', '2025-03-18 11:00:00'),
(16, 4, 13, 'Zerodha',   920.00,   2700, 2, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-19 09:30:00', '2025-03-19 09:30:00'),
(17, 5, 4,  'Angel One', 782.00,   4500, 3, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-20 10:00:00', '2025-03-20 10:00:00'),
(18, 5, 14, 'Zerodha',   780.00,   4500, 3, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-20 10:30:00', '2025-03-20 10:30:00'),
(19, 5, 15, 'Groww',     785.00,   4500, 3, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-21 09:15:00', '2025-03-21 09:15:00'),
(20, 5, 16, 'Upstox',    781.00,   4500, 3, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-21 10:00:00', '2025-03-21 10:00:00'),
(21, 6, 5,  'Zerodha',   1622.00,  1400, 2, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-22 10:15:00', '2025-03-22 10:15:00'),
(22, 6, 17, 'Groww',     1625.00,  1400, 2, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-22 11:00:00', '2025-03-22 11:00:00'),
(23, 6, 18, 'Angel One', 1620.00,  1400, 2, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-23 09:30:00', '2025-03-23 09:30:00'),
(24, 7, 6,  'Zerodha',   3455.00,  150,  1, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-25 10:00:00', '2025-03-25 10:00:00'),
(25, 7, 19, 'Groww',     3450.00,  150,  1, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-25 10:30:00', '2025-03-25 10:30:00'),
(26, 7, 20, 'Upstox',    3460.00,  150,  1, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-26 09:15:00', '2025-03-26 09:15:00'),
(27, 8, 7,  'Zerodha',   146.00,   27500,5, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-28 10:45:00', '2025-03-28 10:45:00'),
(28, 8, 21, 'Groww',     145.00,   27500,5, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-28 11:00:00', '2025-03-28 11:00:00'),
(29, 8, 22, 'Angel One', 147.00,   27500,5, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-03-29 09:30:00', '2025-03-29 09:30:00'),
(30, 9, 8,  'Zerodha',   1892.00,  1400, 2, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-04-01 10:00:00', '2025-04-01 10:00:00'),
(31, 9, 23, 'Groww',     1890.00,  1400, 2, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-04-01 10:30:00', '2025-04-01 10:30:00'),
(32, 9, 24, 'Upstox',    1895.00,  1400, 2, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-04-02 09:15:00', '2025-04-02 09:15:00'),
(33, 10, 9, 'Zerodha',   6810.00,  125,  1, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-04-03 10:15:00', '2025-04-03 10:15:00'),
(34, 10,25, 'Groww',     6800.00,  125,  1, NULL, 'open',   NULL,     NULL, NULL,      NULL,                         '2025-04-03 11:00:00', '2025-04-03 11:00:00'),
(35, 11, 1, 'Zerodha',   1522.00,  600,  2, NULL, 'closed', 1645.00,  NULL, 73800.00,  'Exited at target',           '2025-02-01 10:30:00', '2025-02-25 14:00:00'),
(36, 11, 2, 'Groww',     1525.00,  600,  2, NULL, 'closed', 1640.00,  NULL, 69000.00,  NULL,                         '2025-02-01 11:00:00', '2025-02-24 15:00:00'),
(37, 11, 3, 'Upstox',    1520.00,  600,  2, NULL, 'closed', 1650.00,  NULL, 78000.00,  'Good trade',                 '2025-02-02 09:30:00', '2025-02-26 14:30:00'),
(38, 11,10, 'Zerodha',   1518.00,  600,  2, NULL, 'closed', 1480.00,  NULL,-22800.00,  'Stopped out',                '2025-02-02 10:00:00', '2025-02-15 11:00:00'),
(39, 12, 4, 'Angel One', 10820.00, 100,  1, NULL, 'closed', 11420.00, NULL, 60000.00,  'Target achieved',            '2025-02-05 10:30:00', '2025-03-03 14:00:00'),
(40, 12, 5, 'Zerodha',   10800.00, 100,  1, NULL, 'closed', 11380.00, NULL, 58000.00,  NULL,                         '2025-02-05 11:00:00', '2025-03-02 15:00:00'),
(41, 12,11, 'Groww',     10850.00, 100,  1, NULL, 'closed', 11200.00, NULL, 35000.00,  NULL,                         '2025-02-06 09:30:00', '2025-02-28 14:00:00'),
(42, 13, 6, 'Zerodha',   3210.00,  375,  1, NULL, 'closed', 3480.00,  NULL, 101250.00, 'Excellent trade',            '2025-02-10 10:00:00', '2025-03-08 14:00:00'),
(43, 13, 7, 'Groww',     3205.00,  375,  1, NULL, 'closed', 3460.00,  NULL, 96750.00,  NULL,                         '2025-02-10 10:30:00', '2025-03-07 15:00:00'),
(44, 13,12, 'Upstox',    3200.00,  375,  1, NULL, 'closed', 3100.00,  NULL,-37500.00,  'Stopped out early',          '2025-02-11 09:30:00', '2025-02-20 11:00:00'),
(45, 14, 8, 'Zerodha',   10220.00, 25,   1, NULL, 'closed', 10850.00, NULL, 15750.00,  'Target hit',                 '2025-02-15 10:30:00', '2025-03-12 14:00:00'),
(46, 14,13, 'Groww',     10200.00, 25,   1, NULL, 'closed', 10900.00, NULL, 17500.00,  NULL,                         '2025-02-15 11:00:00', '2025-03-13 15:00:00'),
(47, 15, 9, 'Zerodha',   1678.00,  1100, 2, NULL, 'closed', 1595.00,  NULL, 91300.00,  'Short trade profit',         '2025-02-20 10:00:00', '2025-03-18 14:00:00'),
(48, 15,14, 'Angel One', 1682.00,  1100, 2, NULL, 'closed', 1610.00,  NULL, 79200.00,  NULL,                         '2025-02-20 10:30:00', '2025-03-17 15:00:00'),
(49, 15,15, 'Groww',     1680.00,  1100, 2, NULL, 'closed', 1720.00,  NULL,-44000.00,  'Stopped out',                '2025-02-21 09:30:00', '2025-03-01 11:00:00');

-- ── Notifications ─────────────────────────────────────────────────────────────
INSERT INTO notifications (id, title, message, target_type, target_client_id, created_at, updated_at) VALUES
(1,  'New BUY Call: Reliance Industries',  'A new BUY trade call has been posted for Reliance Industries at ₹2450.00. Strong support at 2450. Q3 results expected strong. Tap to view and book your trade.',  'all', NULL, '2025-03-10 09:30:00', '2025-03-10 09:30:00'),
(2,  'New BUY Call: TCS',                  'A new BUY trade call has been posted for Tata Consultancy Services at ₹3820.00. IT sector recovery expected. Tap to view and book your trade.',                   'all', NULL, '2025-03-12 10:00:00', '2025-03-12 10:00:00'),
(3,  'New BUY Call: ICICI Bank',           'A new BUY trade call has been posted for ICICI Bank at ₹1180.00. Breakout above resistance. Banking sector momentum strong. Tap to view and book.',               'all', NULL, '2025-03-15 09:45:00', '2025-03-15 09:45:00'),
(4,  'New BUY Call: Tata Motors',          'A new BUY trade call has been posted for Tata Motors at ₹920.00. EV segment growing rapidly. JLR recovery on track. Tap to view and book.',                      'all', NULL, '2025-03-18 10:15:00', '2025-03-18 10:15:00'),
(5,  'New BUY Call: SBI',                  'A new BUY trade call has been posted for State Bank of India at ₹780.00. Strong fundamentals. NPA reduction visible. Tap to view and book your trade.',           'all', NULL, '2025-03-20 09:30:00', '2025-03-20 09:30:00'),
(6,  'New BUY Call: Sun Pharma',           'A new BUY trade call has been posted for Sun Pharmaceutical at ₹1620.00. US generics improving. Specialty pipeline strong. Tap to view and book.',               'all', NULL, '2025-03-22 10:00:00', '2025-03-22 10:00:00'),
(7,  'New BUY Call: L&T',                  'A new BUY trade call has been posted for Larsen & Toubro at ₹3450.00. Order book at all-time high. Infrastructure push by government. Tap to view and book.',    'all', NULL, '2025-03-25 09:45:00', '2025-03-25 09:45:00'),
(8,  'New BUY Call: Tata Steel',           'A new BUY trade call has been posted for Tata Steel at ₹145.00. China demand recovery. Domestic steel prices stable. Tap to view and book.',                     'all', NULL, '2025-03-28 10:30:00', '2025-03-28 10:30:00'),
(9,  'New BUY Call: HCL Tech',             'A new BUY trade call has been posted for HCL Technologies at ₹1890.00. Strong deal wins. IT spending recovery in US market. Tap to view and book.',              'all', NULL, '2025-04-01 09:30:00', '2025-04-01 09:30:00'),
(10, 'New BUY Call: Bajaj Finance',        'A new BUY trade call has been posted for Bajaj Finance at ₹6800.00. Credit growth strong. Asset quality stable. Tap to view and book your trade.',               'all', NULL, '2025-04-03 10:00:00', '2025-04-03 10:00:00'),
(11, 'Market Update — April 2025',         'Nifty 50 showing consolidation near 22,500. FII buying visible in banking and IT. Stay invested in quality names. Avoid panic selling.',                          'all', NULL, '2025-04-02 09:00:00', '2025-04-02 09:00:00'),
(12, 'Budget Impact on Markets',           'Union Budget positive for infrastructure and defence sectors. L&T, NTPC, Power Grid expected to benefit. Review your portfolio accordingly.',                      'all', NULL, '2025-02-02 10:00:00', '2025-02-02 10:00:00'),
(13, 'Q3 Results Season Alert',            'Q3 FY25 results season begins. Watch for TCS, Infosys, HDFC Bank results this week. Volatility expected. Manage positions carefully.',                            'all', NULL, '2025-01-10 09:00:00', '2025-01-10 09:00:00'),
(14, 'RBI Policy — Rates Unchanged',       'RBI keeps repo rate unchanged at 6.5%. Positive for banking sector. HDFC Bank, ICICI Bank, SBI expected to benefit from stable rate environment.',               'all', NULL, '2025-02-07 14:00:00', '2025-02-07 14:00:00'),
(15, 'Important: Risk Management Reminder','Always use stop losses on all trades. Never risk more than 2% of capital on a single trade. Swayam Consultancy does not guarantee profits. Trade responsibly.',   'all', NULL, '2025-03-01 09:00:00', '2025-03-01 09:00:00');

-- ── Notification reads ────────────────────────────────────────────────────────
INSERT INTO notification_reads (notification_id, client_id, is_read, created_at) VALUES
(1, 1, 1, '2025-03-10 10:00:00'), (1, 2, 1, '2025-03-10 10:05:00'), (1, 3, 1, '2025-03-10 10:10:00'),
(1, 4, 1, '2025-03-10 10:15:00'), (1, 5, 1, '2025-03-10 10:20:00'), (1, 6, 1, '2025-03-10 11:00:00'),
(2, 1, 1, '2025-03-12 10:30:00'), (2, 2, 1, '2025-03-12 10:35:00'), (2, 6, 1, '2025-03-12 11:00:00'),
(2, 7, 1, '2025-03-12 11:30:00'), (2, 8, 1, '2025-03-13 09:00:00'),
(3, 2, 1, '2025-03-15 10:05:00'), (3, 9, 1, '2025-03-15 10:30:00'), (3, 10, 1, '2025-03-15 11:00:00'),
(4, 3, 1, '2025-03-18 10:30:00'), (4, 12, 1, '2025-03-18 11:00:00'),
(5, 4, 1, '2025-03-20 10:05:00'), (5, 14, 1, '2025-03-20 10:30:00'),
(11, 1, 1, '2025-04-02 09:30:00'), (11, 2, 1, '2025-04-02 09:45:00'), (11, 3, 1, '2025-04-02 10:00:00'),
(12, 1, 1, '2025-02-02 10:30:00'), (12, 5, 1, '2025-02-02 11:00:00'),
(13, 1, 1, '2025-01-10 09:30:00'), (13, 2, 1, '2025-01-10 09:45:00'),
(14, 1, 1, '2025-02-07 14:30:00'), (14, 3, 1, '2025-02-07 15:00:00'),
(15, 1, 1, '2025-03-01 09:30:00'), (15, 2, 1, '2025-03-01 09:45:00'), (15, 4, 1, '2025-03-01 10:00:00');

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Seed complete!
--   Clients: 25 | Stocks: 45 | Trade Calls: 15
--   Trade Bookings: 49 | Notifications: 15 | Reads: 31
-- ============================================================
