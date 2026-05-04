const db = require('../config/db');

const Clients = {
  create: async (data) => {
    const sql = `INSERT INTO clients (name, email, mobile, password, isActive, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;
    const [results] = await db.execute(sql, [data.name, data.email, data.mobile, data.password, data.isActive ?? 1]);
    return { status: 'success', data: results };
  },

  getAll: async () => {
    const [results] = await db.execute('SELECT id, name, email, mobile, isActive, created_at FROM clients ORDER BY created_at DESC');
    return { status: 'success', data: results };
  },

  getAllByPage: async (limit, pageNo, searchtxt) => {
    const offset = (pageNo - 1) * limit;
    let query = 'SELECT id, name, email, mobile, isActive, created_at FROM clients';
    let params = [];
    if (searchtxt) {
      query += ' WHERE name LIKE ? OR email LIKE ? OR mobile LIKE ?';
      params = [`%${searchtxt}%`, `%${searchtxt}%`, `%${searchtxt}%`];
    }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    const [results] = await db.execute(query, params);
    const countQuery = searchtxt
      ? 'SELECT COUNT(*) AS totalCount FROM clients WHERE name LIKE ? OR email LIKE ? OR mobile LIKE ?'
      : 'SELECT COUNT(*) AS totalCount FROM clients';
    const countParams = searchtxt ? [`%${searchtxt}%`, `%${searchtxt}%`, `%${searchtxt}%`] : [];
    const [countResult] = await db.execute(countQuery, countParams);
    return { status: 'success', data: results, totalCount: countResult[0].totalCount };
  },

  getById: async (id) => {
    const [results] = await db.execute('SELECT id, name, email, mobile, isActive, created_at FROM clients WHERE id=?', [id]);
    return { status: 'success', data: results[0] };
  },

  findByEmail: async (email) => {
    const [results] = await db.execute('SELECT * FROM clients WHERE email=?', [email]);
    return { status: 'success', data: results[0] };
  },

  update: async (id, data) => {
    const fields = ['name=?', 'mobile=?', 'updated_at=NOW()'];
    const params = [data.name, data.mobile];
    if (data.password) { fields.push('password=?'); params.push(data.password); }
    params.push(id);
    await db.execute(`UPDATE clients SET ${fields.join(', ')} WHERE id=?`, params);
    const [updated] = await db.execute('SELECT id, name, email, mobile, isActive, created_at FROM clients WHERE id=?', [id]);
    return { status: 'success', data: updated[0] };
  },

  updateStatus: async (id, isActive) => {
    await db.execute('UPDATE clients SET isActive=?, updated_at=NOW() WHERE id=?', [isActive, id]);
    return { status: 'success' };
  },

  updateToken: async (id, token) => {
    await db.execute('UPDATE clients SET token=?, updated_at=NOW() WHERE id=?', [token, id]);
  },

  delete: async (id) => {
    const [results] = await db.execute('DELETE FROM clients WHERE id=?', [id]);
    return results;
  }
};

module.exports = Clients;
