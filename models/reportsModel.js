const db = require('../config/db');

const Reports = {
  // ── Client report ─────────────────────────────────────────────────────────
  getClientReport: async (clientId, fromDate, toDate) => {
    let query = `
      SELECT tb.*, tc.call_type, tc.recommended_price, tc.description AS call_desc,
             s.name AS stock_name, s.symbol, s.lot_size
      FROM trade_bookings tb
      JOIN trade_calls tc ON tb.call_id = tc.id
      JOIN stocks s ON tc.stock_id = s.id
      WHERE tb.client_id = ?`;
    const params = [clientId];
    if (fromDate) { query += ' AND DATE(tb.created_at) >= ?'; params.push(fromDate); }
    if (toDate)   { query += ' AND DATE(tb.created_at) <= ?'; params.push(toDate); }
    query += ' ORDER BY tb.created_at DESC';
    const [results] = await db.execute(query, params);

    // Summary
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
      FROM trade_bookings WHERE client_id = ?`,
      [clientId]
    );

    // Monthly P&L for chart
    const [monthly] = await db.execute(`
      SELECT
        DATE_FORMAT(updated_at, '%b %Y') AS month,
        YEAR(updated_at) AS yr, MONTH(updated_at) AS mo,
        COALESCE(SUM(CASE WHEN pnl > 0 THEN pnl ELSE 0 END), 0) AS profit,
        COALESCE(SUM(CASE WHEN pnl < 0 THEN ABS(pnl) ELSE 0 END), 0) AS loss,
        COALESCE(SUM(pnl), 0) AS net_pnl,
        COUNT(*) AS trades
      FROM trade_bookings
      WHERE client_id = ? AND status = 'closed'
      GROUP BY yr, mo, month
      ORDER BY yr ASC, mo ASC`,
      [clientId]
    );

    return { status: 'success', data: results, summary: summary[0], monthly };
  },

  // ── Admin report ──────────────────────────────────────────────────────────
  getAdminReport: async (fromDate, toDate, clientId) => {
    let query = `
      SELECT tb.*, tc.call_type, tc.recommended_price,
             s.name AS stock_name, s.symbol,
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

    // Admin summary
    let sumQ = `
      SELECT
        COUNT(*) AS total_trades,
        COALESCE(SUM(CASE WHEN status='open'   THEN 1 ELSE 0 END), 0) AS open_trades,
        COALESCE(SUM(CASE WHEN status='closed' THEN 1 ELSE 0 END), 0) AS closed_trades,
        COALESCE(SUM(CASE WHEN status='open'   THEN booking_price * quantity ELSE 0 END), 0) AS used_margin,
        COALESCE(SUM(CASE WHEN status='closed' THEN pnl ELSE 0 END), 0) AS total_realized_pnl,
        COALESCE(SUM(CASE WHEN status='closed' AND pnl > 0 THEN pnl ELSE 0 END), 0) AS gross_profit,
        COALESCE(SUM(CASE WHEN status='closed' AND pnl < 0 THEN pnl ELSE 0 END), 0) AS gross_loss
      FROM trade_bookings WHERE 1=1`;
    const sumP = [];
    if (clientId) { sumQ += ' AND client_id = ?'; sumP.push(clientId); }
    if (fromDate) { sumQ += ' AND DATE(created_at) >= ?'; sumP.push(fromDate); }
    if (toDate)   { sumQ += ' AND DATE(created_at) <= ?'; sumP.push(toDate); }
    const [summary] = await db.execute(sumQ, sumP);

    // Monthly P&L for chart
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
};

module.exports = Reports;
