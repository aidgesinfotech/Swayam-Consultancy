const db = require('../config/db');

const TradeBookings = {
  // ── Client ─────────────────────────────────────────────────────────────────
  create: async (data) => {
    const [result] = await db.execute(
      `INSERT INTO trade_bookings
        (call_id, client_id, platform, booking_price, quantity, lots, entry_screenshot, status, notes, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,NOW(),NOW())`,
      [data.call_id, data.client_id, data.platform || null,
       data.booking_price, data.quantity, data.lots || null,
       data.entry_screenshot || null, 'open', data.notes || null]
    );
    return { status: 'success', insertId: result.insertId };
  },

  // Check if client already booked this call
  getByCallAndClient: async (callId, clientId) => {
    const [rows] = await db.execute(
      'SELECT * FROM trade_bookings WHERE call_id=? AND client_id=?', [callId, clientId]
    );
    return rows[0] || null;
  },

  // Client closes their booking
  close: async (id, clientId, data) => {
    const pnl = (data.closing_price - data.booking_price) * data.quantity;
    await db.execute(
      `UPDATE trade_bookings SET status='closed', closing_price=?, exit_screenshot=?, pnl=?, updated_at=NOW()
       WHERE id=? AND client_id=?`,
      [data.closing_price, data.exit_screenshot || null, pnl, id, clientId]
    );
    return { status: 'success', pnl };
  },

  // Client's all bookings (portfolio view)
  getMyBookings: async (clientId, status) => {
    let query = `SELECT tb.*, tc.call_type, tc.recommended_price, tc.target_price, tc.stop_loss,
                        tc.is_active AS call_is_active, tc.description AS call_description,
                        s.name AS stock_name, s.symbol, s.lot_size
                 FROM trade_bookings tb
                 JOIN trade_calls tc ON tb.call_id = tc.id
                 JOIN stocks s ON tc.stock_id = s.id
                 WHERE tb.client_id = ?`;
    const params = [clientId];
    if (status) { query += ' AND tb.status = ?'; params.push(status); }
    query += ' ORDER BY tb.created_at DESC';
    const [results] = await db.execute(query, params);
    return { status: 'success', data: results };
  },

  // Client portfolio summary
  getMySummary: async (clientId) => {
    const [rows] = await db.execute(
      `SELECT
         COUNT(*) AS total_bookings,
         COALESCE(SUM(CASE WHEN status='open' THEN 1 ELSE 0 END), 0) AS open_bookings,
         COALESCE(SUM(CASE WHEN status='closed' THEN 1 ELSE 0 END), 0) AS closed_bookings,
         COALESCE(SUM(CASE WHEN status='open' THEN booking_price * quantity ELSE 0 END), 0) AS used_margin,
         COALESCE(SUM(CASE WHEN status='closed' THEN pnl ELSE 0 END), 0) AS total_realized_pnl
       FROM trade_bookings WHERE client_id = ?`,
      [clientId]
    );
    return { status: 'success', data: rows[0] };
  },

  getById: async (id, clientId) => {
    const [rows] = await db.execute(
      `SELECT tb.*, tc.call_type, tc.recommended_price, tc.target_price, tc.stop_loss,
              tc.is_active AS call_is_active, tc.description AS call_description,
              s.name AS stock_name, s.symbol, s.lot_size
       FROM trade_bookings tb
       JOIN trade_calls tc ON tb.call_id = tc.id
       JOIN stocks s ON tc.stock_id = s.id
       WHERE tb.id = ? AND tb.client_id = ?`,
      [id, clientId]
    );
    return { status: 'success', data: rows[0] };
  },

  // ── Admin ──────────────────────────────────────────────────────────────────
  getByCallId: async (callId) => {
    const [rows] = await db.execute(
      `SELECT tb.*, c.name AS client_name, c.email, c.mobile
       FROM trade_bookings tb
       JOIN clients c ON tb.client_id = c.id
       WHERE tb.call_id = ?
       ORDER BY tb.created_at DESC`,
      [callId]
    );
    return { status: 'success', data: rows };
  },
};

module.exports = TradeBookings;
