const db = require('../config/db');

const Transactions = {
  create: async (data) => {
    const sql = `INSERT INTO transactions
      (client_id, stock_id, type, quantity, lots, buy_price, sell_price, proof_image, notes, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    const [results] = await db.execute(sql, [
      data.client_id, data.stock_id, data.type,
      data.quantity, data.lots || null,
      data.buy_price || null, data.sell_price || null,
      data.proof_image || null, data.notes || null,
      data.status || 'open'
    ]);
    return { status: 'success', data: results };
  },

  getAllByClient: async (clientId, limit, pageNo, type) => {
    const offset = (pageNo - 1) * limit;
    let query = `SELECT t.*, s.name AS stock_name, s.lot_size
                 FROM transactions t
                 JOIN stocks s ON t.stock_id = s.id
                 WHERE t.client_id = ?`;
    const params = [clientId];
    if (type) { query += ' AND t.type = ?'; params.push(type); }
    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    const [results] = await db.execute(query, params);

    let countQuery = 'SELECT COUNT(*) AS totalCount FROM transactions WHERE client_id = ?';
    const countParams = [clientId];
    if (type) { countQuery += ' AND type = ?'; countParams.push(type); }
    const [countResult] = await db.execute(countQuery, countParams);

    return { status: 'success', data: results, totalCount: countResult[0].totalCount };
  },

  getAllByPage: async (limit, pageNo, searchtxt, clientId) => {
    const offset = (pageNo - 1) * limit;
    let query = `SELECT t.*, s.name AS stock_name, c.name AS client_name
                 FROM transactions t
                 JOIN stocks s ON t.stock_id = s.id
                 JOIN clients c ON t.client_id = c.id
                 WHERE 1=1`;
    const params = [];
    if (clientId) { query += ' AND t.client_id = ?'; params.push(clientId); }
    if (searchtxt) { query += ' AND (s.name LIKE ? OR c.name LIKE ?)'; params.push(`%${searchtxt}%`, `%${searchtxt}%`); }
    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    const [results] = await db.execute(query, params);

    let countQuery = `SELECT COUNT(*) AS totalCount FROM transactions t
                      JOIN stocks s ON t.stock_id = s.id
                      JOIN clients c ON t.client_id = c.id WHERE 1=1`;
    const countParams = [];
    if (clientId) { countQuery += ' AND t.client_id = ?'; countParams.push(clientId); }
    if (searchtxt) { countQuery += ' AND (s.name LIKE ? OR c.name LIKE ?)'; countParams.push(`%${searchtxt}%`, `%${searchtxt}%`); }
    const [countResult] = await db.execute(countQuery, countParams);

    return { status: 'success', data: results, totalCount: countResult[0].totalCount };
  },

  getById: async (id) => {
    const [results] = await db.execute(
      `SELECT t.*, s.name AS stock_name, s.lot_size, c.name AS client_name
       FROM transactions t
       JOIN stocks s ON t.stock_id = s.id
       JOIN clients c ON t.client_id = c.id
       WHERE t.id = ?`, [id]
    );
    return { status: 'success', data: results[0] };
  },

  update: async (id, data) => {
    const sql = `UPDATE transactions SET quantity=?, lots=?, buy_price=?, sell_price=?, proof_image=?, notes=?, status=?, updated_at=NOW() WHERE id=?`;
    await db.execute(sql, [data.quantity, data.lots || null, data.buy_price || null, data.sell_price || null, data.proof_image || null, data.notes || null, data.status || 'open', id]);
    return { status: 'success' };
  },

  delete: async (id) => {
    const [results] = await db.execute('DELETE FROM transactions WHERE id=?', [id]);
    return results;
  },

  getPortfolioByClient: async (clientId) => {
    const [results] = await db.execute(
      `SELECT t.stock_id, s.name AS stock_name, s.lot_size,
              SUM(CASE WHEN t.type='buy' THEN t.quantity ELSE 0 END) AS total_qty_bought,
              SUM(CASE WHEN t.type='sell' THEN t.quantity ELSE 0 END) AS total_qty_sold,
              SUM(CASE WHEN t.type='buy' THEN t.quantity ELSE 0 END) - SUM(CASE WHEN t.type='sell' THEN t.quantity ELSE 0 END) AS holding_qty,
              AVG(CASE WHEN t.type='buy' THEN t.buy_price ELSE NULL END) AS avg_buy_price,
              SUM(CASE WHEN t.type='buy' THEN t.quantity * t.buy_price ELSE 0 END) AS total_invested
       FROM transactions t
       JOIN stocks s ON t.stock_id = s.id
       WHERE t.client_id = ?
       GROUP BY t.stock_id, s.name, s.lot_size
       HAVING holding_qty > 0
       ORDER BY s.name ASC`,
      [clientId]
    );
    return { status: 'success', data: results };
  },

  getSummaryByClient: async (clientId) => {
    const [results] = await db.execute(
      `SELECT
        SUM(CASE WHEN type='buy' THEN quantity * buy_price ELSE 0 END) AS total_invested,
        SUM(CASE WHEN type='sell' THEN quantity * sell_price ELSE 0 END) AS total_realized,
        COUNT(CASE WHEN type='buy' THEN 1 END) AS total_buys,
        COUNT(CASE WHEN type='sell' THEN 1 END) AS total_sells
       FROM transactions WHERE client_id = ?`,
      [clientId]
    );
    return { status: 'success', data: results[0] };
  }
};

module.exports = Transactions;
