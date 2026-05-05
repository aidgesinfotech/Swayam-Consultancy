const db = require('../config/db');

const TradeCalls = {
  // ── Admin ──────────────────────────────────────────────────────────────────
  create: async (data) => {
    const [result] = await db.execute(
      `INSERT INTO trade_calls
        (stock_id, call_type, recommended_price, target_price, lots, description, is_active, created_at, updated_at)
       VALUES (?,?,?,?,?,?,1,NOW(),NOW())`,
      [data.stock_id, data.call_type || 'BUY', data.recommended_price,
       data.target_price || null,
       data.lots || 1, data.description || null]
    );
    return { status: 'success', insertId: result.insertId };
  },

  getAllByPage: async (limit, pageNo, searchtxt, isActive) => {
    const offset = (pageNo - 1) * limit;
    let query = `SELECT tc.*, s.name AS stock_name, s.lot_size, s.qty, s.expiry_date, s.strike_price,
                   (SELECT COUNT(*) FROM trade_bookings tb WHERE tb.call_id = tc.id) AS total_bookings,
                   (SELECT COUNT(*) FROM trade_bookings tb WHERE tb.call_id = tc.id AND tb.status='open') AS open_bookings,
                   (SELECT COUNT(*) FROM trade_bookings tb WHERE tb.call_id = tc.id AND tb.status='closed') AS closed_bookings,
                   (SELECT SUM(tb.pnl) FROM trade_bookings tb WHERE tb.call_id = tc.id AND tb.status='closed') AS total_pnl
                 FROM trade_calls tc
                 JOIN stocks s ON tc.stock_id = s.id
                 WHERE 1=1`;
    const params = [];
    if (isActive !== undefined && isActive !== '') {
      query += ' AND tc.is_active = ?'; params.push(isActive);
    }
    if (searchtxt) {
      query += ' AND s.name LIKE ?';
      params.push(`%${searchtxt}%`);
    }
    query += ' ORDER BY tc.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    const [results] = await db.execute(query, params);

    let countQ = `SELECT COUNT(*) AS totalCount FROM trade_calls tc JOIN stocks s ON tc.stock_id = s.id WHERE 1=1`;
    const countP = [];
    if (isActive !== undefined && isActive !== '') { countQ += ' AND tc.is_active = ?'; countP.push(isActive); }
    if (searchtxt) { countQ += ' AND s.name LIKE ?'; countP.push(`%${searchtxt}%`); }
    const [countResult] = await db.execute(countQ, countP);
    return { status: 'success', data: results, totalCount: countResult[0].totalCount };
  },

  getById: async (id) => {
    const [rows] = await db.execute(
      `SELECT tc.*, s.name AS stock_name, s.lot_size, s.qty, s.expiry_date, s.strike_price
       FROM trade_calls tc JOIN stocks s ON tc.stock_id = s.id WHERE tc.id = ?`, [id]
    );
    return { status: 'success', data: rows[0] };
  },

  update: async (id, data) => {
    await db.execute(
      `UPDATE trade_calls SET stock_id=?, call_type=?, recommended_price=?, target_price=?,
       lots=?, description=?, updated_at=NOW() WHERE id=?`,
      [data.stock_id, data.call_type, data.recommended_price,
       data.target_price || null,
       data.lots || 1, data.description || null, id]
    );
    return { status: 'success' };
  },

  toggleActive: async (id, isActive) => {
    await db.execute('UPDATE trade_calls SET is_active=?, updated_at=NOW() WHERE id=?', [isActive, id]);
    return { status: 'success' };
  },

  delete: async (id) => {
    await db.execute('DELETE FROM trade_calls WHERE id=?', [id]);
    return { status: 'success' };
  },

  // ── Client ─────────────────────────────────────────────────────────────────
  // All active + inactive calls for client feed (with their booking if any)
  getAllForClient: async (clientId, limit, pageNo) => {
    const offset = (pageNo - 1) * limit;
    const [results] = await db.execute(
      `SELECT tc.*, s.name AS stock_name, s.lot_size, s.qty, s.expiry_date, s.strike_price,
              tb.id AS booking_id, tb.status AS booking_status,
              tb.booking_price, tb.quantity AS booked_qty, tb.lots AS booked_lots,
              tb.pnl AS booking_pnl
       FROM trade_calls tc
       JOIN stocks s ON tc.stock_id = s.id
       LEFT JOIN trade_bookings tb ON tb.call_id = tc.id AND tb.client_id = ?
       ORDER BY tc.is_active DESC, tc.created_at DESC
       LIMIT ? OFFSET ?`,
      [clientId, limit, offset]
    );
    const [countResult] = await db.execute('SELECT COUNT(*) AS totalCount FROM trade_calls');
    return { status: 'success', data: results, totalCount: countResult[0].totalCount };
  },

  getByIdForClient: async (id, clientId) => {
    const [rows] = await db.execute(
      `SELECT tc.*, s.name AS stock_name, s.lot_size, s.qty, s.expiry_date, s.strike_price,
              tb.id AS booking_id, tb.status AS booking_status,
              tb.booking_price, tb.quantity AS booked_qty, tb.lots AS booked_lots,
              tb.platform, tb.entry_screenshot, tb.exit_screenshot,
              tb.closing_price, tb.pnl AS booking_pnl, tb.notes AS booking_notes
       FROM trade_calls tc
       JOIN stocks s ON tc.stock_id = s.id
       LEFT JOIN trade_bookings tb ON tb.call_id = tc.id AND tb.client_id = ?
       WHERE tc.id = ?`,
      [clientId, id]
    );
    return { status: 'success', data: rows[0] };
  },
};

module.exports = TradeCalls;
