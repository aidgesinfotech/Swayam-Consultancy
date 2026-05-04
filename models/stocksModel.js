const db = require('../config/db');

const Stocks = {
  create: async (data) => {
    const sql = `INSERT INTO stocks (name, symbol, lot_size, sector, isActive, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;
    const [results] = await db.execute(sql, [data.name, data.symbol, data.lot_size, data.sector || null, data.isActive ?? 1]);
    return { status: 'success', data: results };
  },

  getAll: async () => {
    const [results] = await db.execute(`SELECT * FROM stocks ORDER BY name ASC`);
    return { status: 'success', data: results };
  },

  getAllByPage: async (limit, pageNo, searchtxt) => {
    const offset = (pageNo - 1) * limit;
    let query = 'SELECT * FROM stocks';
    let params = [];
    if (searchtxt) {
      query += ' WHERE name LIKE ? OR symbol LIKE ?';
      params = [`%${searchtxt}%`, `%${searchtxt}%`];
    }
    query += ' ORDER BY name ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    const [results] = await db.execute(query, params);
    const countQuery = searchtxt
      ? 'SELECT COUNT(*) AS totalCount FROM stocks WHERE name LIKE ? OR symbol LIKE ?'
      : 'SELECT COUNT(*) AS totalCount FROM stocks';
    const countParams = searchtxt ? [`%${searchtxt}%`, `%${searchtxt}%`] : [];
    const [countResult] = await db.execute(countQuery, countParams);
    return { status: 'success', data: results, totalCount: countResult[0].totalCount };
  },

  getById: async (id) => {
    const [results] = await db.execute('SELECT * FROM stocks WHERE id = ?', [id]);
    return { status: 'success', data: results[0] };
  },

  update: async (id, data) => {
    const sql = `UPDATE stocks SET name=?, symbol=?, lot_size=?, sector=?, isActive=?, updated_at=NOW() WHERE id=?`;
    await db.execute(sql, [data.name, data.symbol, data.lot_size, data.sector || null, data.isActive ?? 1, id]);
    const [updated] = await db.execute('SELECT * FROM stocks WHERE id=?', [id]);
    return { status: 'success', data: updated[0] };
  },

  updateStatus: async (id, isActive) => {
    await db.execute('UPDATE stocks SET isActive=?, updated_at=NOW() WHERE id=?', [isActive, id]);
    return { status: 'success' };
  },

  delete: async (id) => {
    const [results] = await db.execute('DELETE FROM stocks WHERE id=?', [id]);
    return results;
  },

  bulkUpsert: async (rows) => {
    for (const row of rows) {
      const [existing] = await db.execute('SELECT id FROM stocks WHERE symbol=?', [row.symbol]);
      if (existing.length > 0) {
        await db.execute(
          'UPDATE stocks SET name=?, lot_size=?, sector=?, updated_at=NOW() WHERE symbol=?',
          [row.name, row.lot_size, row.sector || null, row.symbol]
        );
      } else {
        await db.execute(
          'INSERT INTO stocks (name, symbol, lot_size, sector, isActive, created_at, updated_at) VALUES (?,?,?,?,1,NOW(),NOW())',
          [row.name, row.symbol, row.lot_size, row.sector || null]
        );
      }
    }
    return { status: 'success' };
  }
};

module.exports = Stocks;
