const db = require('../config/db');

const Reports = {

  // ── Client report (UI — client's own report) ──────────────────────────────
  getClientReport: async (clientId, fromDate, toDate) => {
    let query = `
      SELECT tb.*, tc.call_type, tc.recommended_price, tc.target_price,
             tc.description AS call_desc, tc.is_active AS call_is_active,
             s.name AS stock_name, s.lot_size, s.expiry_date, s.strike_price
      FROM trade_bookings tb
      JOIN trade_calls tc ON tb.call_id = tc.id
      JOIN stocks s ON tc.stock_id = s.id
      WHERE tb.client_id = ?`;
    const params = [clientId];
    if (fromDate) { query += ' AND DATE(tb.created_at) >= ?'; params.push(fromDate); }
    if (toDate)   { query += ' AND DATE(tb.created_at) <= ?'; params.push(toDate); }
    query += ' ORDER BY tb.created_at DESC';
    const [results] = await db.execute(query, params);

    const [summary] = await db.execute(`
      SELECT
        COUNT(*) AS total_trades,
        COALESCE(SUM(CASE WHEN status='open'   THEN 1 ELSE 0 END), 0) AS open_trades,
        COALESCE(SUM(CASE WHEN status='closed' THEN 1 ELSE 0 END), 0) AS closed_trades,
        COALESCE(SUM(CASE WHEN status='open'   THEN booking_price * quantity ELSE 0 END), 0) AS used_margin,
        COALESCE(SUM(CASE WHEN status='closed' THEN pnl ELSE 0 END), 0) AS total_realized_pnl,
        COALESCE(SUM(CASE WHEN status='closed' AND pnl > 0 THEN 1 ELSE 0 END), 0) AS winning_trades,
        COALESCE(SUM(CASE WHEN status='closed' AND pnl < 0 THEN 1 ELSE 0 END), 0) AS losing_trades,
        COALESCE(SUM(CASE WHEN status='closed' AND pnl > 0 THEN pnl ELSE 0 END), 0) AS gross_profit,
        COALESCE(SUM(CASE WHEN status='closed' AND pnl < 0 THEN pnl ELSE 0 END), 0) AS gross_loss
      FROM trade_bookings WHERE client_id = ?`, [clientId]
    );

    const [monthly] = await db.execute(`
      SELECT DATE_FORMAT(updated_at,'%b %Y') AS month,
             YEAR(updated_at) AS yr, MONTH(updated_at) AS mo,
             COALESCE(SUM(CASE WHEN pnl>0 THEN pnl ELSE 0 END),0) AS profit,
             COALESCE(SUM(CASE WHEN pnl<0 THEN ABS(pnl) ELSE 0 END),0) AS loss,
             COALESCE(SUM(pnl),0) AS net_pnl, COUNT(*) AS trades
      FROM trade_bookings
      WHERE client_id = ? AND status = 'closed'
      GROUP BY yr, mo, month ORDER BY yr ASC, mo ASC`, [clientId]
    );

    return { status: 'success', data: results, summary: summary[0], monthly };
  },

  // ── Admin report ──────────────────────────────────────────────────────────
  getAdminReport: async (fromDate, toDate, clientId) => {
    let query = `
      SELECT tb.*, tc.call_type, tc.recommended_price, tc.target_price,
             s.name AS stock_name,
             c.name AS client_name, c.email
      FROM trade_bookings tb
      JOIN trade_calls tc ON tb.call_id = tc.id
      JOIN stocks s ON tc.stock_id = s.id
      JOIN clients c ON tb.client_id = c.id
      WHERE 1=1`;
    const params = [];
    if (clientId) { query += ' AND tb.client_id = ?'; params.push(clientId); }
    if (fromDate) { query += ' AND DATE(tb.created_at) >= ?'; params.push(fromDate); }
    if (toDate)   { query += ' AND DATE(tb.created_at) <= ?'; params.push(toDate); }
    query += ' ORDER BY tb.created_at DESC';
    const [results] = await db.execute(query, params);

    let sumQ = `
      SELECT
        COUNT(*) AS total_trades,
        COALESCE(SUM(CASE WHEN status='open'   THEN 1 ELSE 0 END), 0) AS open_trades,
        COALESCE(SUM(CASE WHEN status='closed' THEN 1 ELSE 0 END), 0) AS closed_trades,
        COALESCE(SUM(CASE WHEN status='open'   THEN booking_price * quantity ELSE 0 END), 0) AS used_margin,
        COALESCE(SUM(CASE WHEN status='closed' THEN pnl ELSE 0 END), 0) AS total_realized_pnl,
        COALESCE(SUM(CASE WHEN status='closed' AND pnl > 0 THEN pnl ELSE 0 END), 0) AS gross_profit,
        COALESCE(SUM(CASE WHEN status='closed' AND pnl < 0 THEN pnl ELSE 0 END), 0) AS gross_loss,
        COALESCE(SUM(CASE WHEN status='closed' AND pnl > 0 THEN 1 ELSE 0 END), 0) AS winning_trades,
        COALESCE(SUM(CASE WHEN status='closed' AND pnl < 0 THEN 1 ELSE 0 END), 0) AS losing_trades
      FROM trade_bookings WHERE 1=1`;
    const sumP = [];
    if (clientId) { sumQ += ' AND client_id = ?'; sumP.push(clientId); }
    if (fromDate) { sumQ += ' AND DATE(created_at) >= ?'; sumP.push(fromDate); }
    if (toDate)   { sumQ += ' AND DATE(created_at) <= ?'; sumP.push(toDate); }
    const [summary] = await db.execute(sumQ, sumP);

    let monthQ = `
      SELECT DATE_FORMAT(updated_at,'%b %Y') AS month,
             YEAR(updated_at) AS yr, MONTH(updated_at) AS mo,
             COALESCE(SUM(CASE WHEN pnl>0 THEN pnl ELSE 0 END),0) AS profit,
             COALESCE(SUM(CASE WHEN pnl<0 THEN ABS(pnl) ELSE 0 END),0) AS loss,
             COALESCE(SUM(pnl),0) AS net_pnl, COUNT(*) AS trades
      FROM trade_bookings WHERE status='closed'`;
    const monthP = [];
    if (clientId) { monthQ += ' AND client_id = ?'; monthP.push(clientId); }
    if (fromDate) { monthQ += ' AND DATE(updated_at) >= ?'; monthP.push(fromDate); }
    if (toDate)   { monthQ += ' AND DATE(updated_at) <= ?'; monthP.push(toDate); }
    monthQ += ' GROUP BY yr, mo, month ORDER BY yr ASC, mo ASC';
    const [monthly] = await db.execute(monthQ, monthP);

    return { status: 'success', data: results, summary: summary[0], monthly };
  },

  // ── Client-wise report (admin view of a specific client) ──────────────────
  getClientWiseReport: async (clientId) => {
    const [clientRows] = await db.execute(
      'SELECT id, name, email, mobile, isActive, created_at FROM clients WHERE id = ?', [clientId]
    );
    const client = clientRows[0] || null;

    const [summaryRows] = await db.execute(`
      SELECT
        COUNT(*) AS total_trades,
        COALESCE(SUM(CASE WHEN tb.status='open'   THEN 1 ELSE 0 END), 0) AS open_trades,
        COALESCE(SUM(CASE WHEN tb.status='closed' THEN 1 ELSE 0 END), 0) AS closed_trades,
        COALESCE(SUM(CASE WHEN tb.status='open'   THEN tb.booking_price * tb.quantity ELSE 0 END), 0) AS used_margin,
        COALESCE(SUM(CASE WHEN tb.status='closed' THEN tb.pnl ELSE 0 END), 0) AS total_realized_pnl,
        COALESCE(SUM(CASE WHEN tb.status='closed' AND tb.pnl > 0 THEN tb.pnl ELSE 0 END), 0) AS gross_profit,
        COALESCE(SUM(CASE WHEN tb.status='closed' AND tb.pnl < 0 THEN tb.pnl ELSE 0 END), 0) AS gross_loss,
        COALESCE(SUM(CASE WHEN tb.status='closed' AND tb.pnl > 0 THEN 1 ELSE 0 END), 0) AS winning_trades,
        COALESCE(SUM(CASE WHEN tb.status='closed' AND tb.pnl < 0 THEN 1 ELSE 0 END), 0) AS losing_trades
      FROM trade_bookings tb WHERE tb.client_id = ?`, [clientId]
    );

    const [bookings] = await db.execute(`
      SELECT tb.*,
             tc.call_type, tc.recommended_price, tc.target_price,
             tc.description AS call_desc, tc.is_active AS call_is_active,
             s.name AS stock_name, s.lot_size, s.expiry_date, s.strike_price
      FROM trade_bookings tb
      JOIN trade_calls tc ON tb.call_id = tc.id
      JOIN stocks s ON tc.stock_id = s.id
      WHERE tb.client_id = ?
      ORDER BY tb.created_at DESC`, [clientId]
    );

    const [monthly] = await db.execute(`
      SELECT DATE_FORMAT(updated_at,'%b %Y') AS month,
             YEAR(updated_at) AS yr, MONTH(updated_at) AS mo,
             COALESCE(SUM(CASE WHEN pnl>0 THEN pnl ELSE 0 END),0) AS profit,
             COALESCE(SUM(CASE WHEN pnl<0 THEN ABS(pnl) ELSE 0 END),0) AS loss,
             COALESCE(SUM(pnl),0) AS net_pnl, COUNT(*) AS trades
      FROM trade_bookings
      WHERE client_id = ? AND status = 'closed'
      GROUP BY yr, mo, month ORDER BY yr ASC, mo ASC`, [clientId]
    );

    const [stockBreakdown] = await db.execute(`
      SELECT s.name AS stock_name,
             COUNT(tb.id) AS total_trades,
             COALESCE(SUM(CASE WHEN tb.status='open'   THEN 1 ELSE 0 END), 0) AS open_trades,
             COALESCE(SUM(CASE WHEN tb.status='closed' THEN 1 ELSE 0 END), 0) AS closed_trades,
             COALESCE(SUM(CASE WHEN tb.status='closed' THEN tb.pnl ELSE 0 END), 0) AS total_pnl,
             COALESCE(SUM(CASE WHEN tb.status='closed' AND tb.pnl>0 THEN 1 ELSE 0 END),0) AS wins,
             COALESCE(SUM(CASE WHEN tb.status='closed' AND tb.pnl<0 THEN 1 ELSE 0 END),0) AS losses,
             COALESCE(SUM(CASE WHEN tb.status='open' THEN tb.booking_price*tb.quantity ELSE 0 END),0) AS open_margin
      FROM trade_bookings tb
      JOIN trade_calls tc ON tb.call_id = tc.id
      JOIN stocks s ON tc.stock_id = s.id
      WHERE tb.client_id = ?
      GROUP BY s.id, s.name
      ORDER BY total_pnl DESC`, [clientId]
    );

    return { status: 'success', client, summary: summaryRows[0], bookings, monthly, stockBreakdown };
  },

  // ── Stock-wise report ─────────────────────────────────────────────────────
  getStockWiseReport: async (stockId) => {
    const [stockRows] = await db.execute('SELECT * FROM stocks WHERE id = ?', [stockId]);
    const stock = stockRows[0] || null;

    const [calls] = await db.execute(`
      SELECT tc.id, tc.call_type, tc.recommended_price, tc.target_price,
             tc.lots, tc.description, tc.is_active, tc.created_at,
             COUNT(tb.id) AS total_bookings,
             COALESCE(SUM(CASE WHEN tb.status='open'   THEN 1 ELSE 0 END), 0) AS open_bookings,
             COALESCE(SUM(CASE WHEN tb.status='closed' THEN 1 ELSE 0 END), 0) AS closed_bookings,
             COALESCE(SUM(CASE WHEN tb.status='closed' THEN tb.pnl ELSE 0 END),0) AS total_pnl,
             COALESCE(SUM(CASE WHEN tb.status='closed' AND tb.pnl > 0 THEN 1 ELSE 0 END), 0) AS winning,
             COALESCE(SUM(CASE WHEN tb.status='closed' AND tb.pnl < 0 THEN 1 ELSE 0 END), 0) AS losing,
             COALESCE(SUM(CASE WHEN tb.status='open' THEN tb.booking_price * tb.quantity ELSE 0 END), 0) AS open_margin
      FROM trade_calls tc
      LEFT JOIN trade_bookings tb ON tb.call_id = tc.id
      WHERE tc.stock_id = ?
      GROUP BY tc.id ORDER BY tc.created_at DESC`, [stockId]
    );

    const [summary] = await db.execute(`
      SELECT COUNT(DISTINCT tc.id) AS total_calls,
             COALESCE(SUM(CASE WHEN tc.is_active=1 THEN 1 ELSE 0 END),0) AS active_calls,
             COALESCE(SUM(CASE WHEN tc.is_active=0 THEN 1 ELSE 0 END),0) AS expired_calls,
             COUNT(tb.id) AS total_bookings,
             COALESCE(SUM(CASE WHEN tb.status='open'   THEN 1 ELSE 0 END),0) AS open_positions,
             COALESCE(SUM(CASE WHEN tb.status='closed' THEN 1 ELSE 0 END),0) AS closed_positions,
             COALESCE(SUM(CASE WHEN tb.status='closed' THEN tb.pnl ELSE 0 END),0) AS total_pnl,
             COALESCE(SUM(CASE WHEN tb.status='closed' AND tb.pnl>0 THEN tb.pnl ELSE 0 END),0) AS gross_profit,
             COALESCE(SUM(CASE WHEN tb.status='closed' AND tb.pnl<0 THEN tb.pnl ELSE 0 END),0) AS gross_loss,
             COALESCE(SUM(CASE WHEN tb.status='closed' AND tb.pnl>0 THEN 1 ELSE 0 END),0) AS winning_trades,
             COALESCE(SUM(CASE WHEN tb.status='closed' AND tb.pnl<0 THEN 1 ELSE 0 END),0) AS losing_trades,
             COALESCE(SUM(CASE WHEN tb.status='open' THEN tb.booking_price*tb.quantity ELSE 0 END),0) AS open_margin
      FROM trade_calls tc
      LEFT JOIN trade_bookings tb ON tb.call_id = tc.id
      WHERE tc.stock_id = ?`, [stockId]
    );

    const [bookings] = await db.execute(`
      SELECT tb.*, tc.call_type, tc.recommended_price, tc.is_active AS call_is_active,
             c.name AS client_name, c.email AS client_email
      FROM trade_bookings tb
      JOIN trade_calls tc ON tb.call_id = tc.id
      JOIN clients c ON tb.client_id = c.id
      WHERE tc.stock_id = ? ORDER BY tb.created_at DESC`, [stockId]
    );

    return { status: 'success', stock, calls, summary: summary[0], bookings };
  },
};

module.exports = Reports;
