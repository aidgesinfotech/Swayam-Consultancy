const db = require('../config/db');

const Dashboard = {
  adminDashboard: async () => {
    try {
      // ── Core counts ──────────────────────────────────────────────────────
      const [[{ clients }]]      = await db.execute(`SELECT COUNT(*) AS clients FROM clients`);
      const [[{ activeClients }]]= await db.execute(`SELECT COUNT(*) AS activeClients FROM clients WHERE isActive=1`);
      const [[{ stocks }]]       = await db.execute(`SELECT COUNT(*) AS stocks FROM stocks WHERE isActive=1`);
      const [[{ activeCalls }]]  = await db.execute(`SELECT COUNT(*) AS activeCalls FROM trade_calls WHERE is_active=1`);
      const [[{ expiredCalls }]] = await db.execute(`SELECT COUNT(*) AS expiredCalls FROM trade_calls WHERE is_active=0`);
      const [[{ totalCalls }]]   = await db.execute(`SELECT COUNT(*) AS totalCalls FROM trade_calls`);

      // ── Trade bookings ────────────────────────────────────────────────────
      const [[bookings]] = await db.execute(`
        SELECT
          COUNT(*) AS total_bookings,
          COALESCE(SUM(CASE WHEN status='open'   THEN 1 ELSE 0 END), 0) AS open_bookings,
          COALESCE(SUM(CASE WHEN status='closed' THEN 1 ELSE 0 END), 0) AS closed_bookings,
          COALESCE(SUM(CASE WHEN status='open'   THEN booking_price * quantity ELSE 0 END), 0) AS total_used_margin,
          COALESCE(SUM(CASE WHEN status='closed' THEN pnl ELSE 0 END), 0) AS total_realized_pnl,
          COALESCE(SUM(CASE WHEN status='closed' AND pnl > 0 THEN 1 ELSE 0 END), 0) AS winning_trades,
          COALESCE(SUM(CASE WHEN status='closed' AND pnl < 0 THEN 1 ELSE 0 END), 0) AS losing_trades,
          COALESCE(SUM(CASE WHEN status='closed' AND pnl > 0 THEN pnl ELSE 0 END), 0) AS gross_profit,
          COALESCE(SUM(CASE WHEN status='closed' AND pnl < 0 THEN pnl ELSE 0 END), 0) AS gross_loss
        FROM trade_bookings`);

      // ── Top performing clients ────────────────────────────────────────────
      const [topClients] = await db.execute(`
        SELECT c.id, c.name, c.email,
          COUNT(tb.id) AS total_trades,
          COALESCE(SUM(CASE WHEN tb.status='open' THEN 1 ELSE 0 END), 0) AS open_trades,
          COALESCE(SUM(CASE WHEN tb.status='closed' THEN tb.pnl ELSE 0 END), 0) AS realized_pnl,
          COALESCE(SUM(CASE WHEN tb.status='open' THEN tb.booking_price * tb.quantity ELSE 0 END), 0) AS used_margin
        FROM clients c
        LEFT JOIN trade_bookings tb ON tb.client_id = c.id
        GROUP BY c.id, c.name, c.email
        ORDER BY realized_pnl DESC
        LIMIT 10`);

      // ── Top performing calls ──────────────────────────────────────────────
      const [topCalls] = await db.execute(`
        SELECT tc.id, tc.call_type, tc.recommended_price, tc.is_active,
          s.name AS stock_name,
          COUNT(tb.id) AS total_bookings,
          COALESCE(SUM(CASE WHEN tb.status='closed' THEN tb.pnl ELSE 0 END), 0) AS total_pnl,
          COALESCE(SUM(CASE WHEN tb.status='open' THEN 1 ELSE 0 END), 0) AS open_bookings,
          COALESCE(SUM(CASE WHEN tb.status='closed' THEN 1 ELSE 0 END), 0) AS closed_bookings
        FROM trade_calls tc
        JOIN stocks s ON tc.stock_id = s.id
        LEFT JOIN trade_bookings tb ON tb.call_id = tc.id
        GROUP BY tc.id, tc.call_type, tc.recommended_price, tc.is_active, s.name
        ORDER BY total_bookings DESC
        LIMIT 8`);

      // ── Monthly P&L trend (last 6 months) ────────────────────────────────
      const [monthlyPnl] = await db.execute(`
        SELECT
          DATE_FORMAT(updated_at, '%b %Y') AS month,
          YEAR(updated_at) AS yr,
          MONTH(updated_at) AS mo,
          COALESCE(SUM(CASE WHEN pnl > 0 THEN pnl ELSE 0 END), 0) AS profit,
          COALESCE(SUM(CASE WHEN pnl < 0 THEN pnl ELSE 0 END), 0) AS loss,
          COALESCE(SUM(pnl), 0) AS net_pnl,
          COUNT(*) AS trades
        FROM trade_bookings
        WHERE status='closed' AND updated_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY yr, mo, month
        ORDER BY yr ASC, mo ASC`);

      // ── Sector distribution of open bookings ─────────────────────────────
      // sector column removed — skipping sector distribution query
      const sectorDist = [];

      // ── Recent activity (last 10 bookings) ───────────────────────────────
      const [recentActivity] = await db.execute(`
        SELECT tb.id, tb.status, tb.booking_price, tb.quantity, tb.pnl,
          tb.created_at, tb.updated_at,
          c.name AS client_name,
          s.name AS stock_name,
          tc.call_type
        FROM trade_bookings tb
        JOIN clients c ON tb.client_id = c.id
        JOIN trade_calls tc ON tb.call_id = tc.id
        JOIN stocks s ON tc.stock_id = s.id
        ORDER BY tb.updated_at DESC
        LIMIT 10`);

      // ── New clients this month ────────────────────────────────────────────
      const [[{ newClientsMonth }]] = await db.execute(`
        SELECT COUNT(*) AS newClientsMonth FROM clients
        WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())`);

      // ── Win rate ──────────────────────────────────────────────────────────
      const winRate = bookings.closed_bookings > 0
        ? ((bookings.winning_trades / bookings.closed_bookings) * 100).toFixed(1)
        : 0;

      return {
        status: 'success',
        data: {
          // Counts
          clients, activeClients, newClientsMonth,
          stocks, activeCalls, expiredCalls, totalCalls,
          // Bookings summary
          total_bookings:    bookings.total_bookings,
          open_bookings:     bookings.open_bookings,
          closed_bookings:   bookings.closed_bookings,
          total_used_margin: bookings.total_used_margin,
          total_realized_pnl:bookings.total_realized_pnl,
          winning_trades:    bookings.winning_trades,
          losing_trades:     bookings.losing_trades,
          gross_profit:      bookings.gross_profit,
          gross_loss:        bookings.gross_loss,
          win_rate:          winRate,
          // Lists
          topClients,
          topCalls,
          monthlyPnl,
          sectorDist,
          recentActivity,
        }
      };
    } catch (err) {
      throw err;
    }
  },
};

module.exports = Dashboard;
