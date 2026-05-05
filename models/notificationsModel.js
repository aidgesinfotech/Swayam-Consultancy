const db = require('../config/db');

const Notifications = {
  create: async (data) => {
    // target_type: 'all' | 'specific', target_client_id: null or id
    const sql = `INSERT INTO notifications (title, message, target_type, target_client_id, created_at, updated_at)
                 VALUES (?, ?, ?, ?, NOW(), NOW())`;
    const [results] = await db.execute(sql, [
      data.title, data.message,
      data.target_type || 'all',
      data.target_client_id || null
    ]);
    return { status: 'success', data: results };
  },

  getAllByPage: async (limit, pageNo) => {
    const offset = (pageNo - 1) * limit;
    const [results] = await db.execute(
      `SELECT n.*, c.name AS client_name FROM notifications n
       LEFT JOIN clients c ON n.target_client_id = c.id
       ORDER BY n.created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    const [countResult] = await db.execute('SELECT COUNT(*) AS totalCount FROM notifications');
    return { status: 'success', data: results, totalCount: countResult[0].totalCount };
  },

  getForClient: async (clientId, limit, pageNo) => {
    const offset = (pageNo - 1) * limit;
    const [results] = await db.execute(
      `SELECT n.*, nr.is_read FROM notifications n
       LEFT JOIN notification_reads nr ON n.id = nr.notification_id AND nr.client_id = ?
       WHERE n.target_type = 'all' OR n.target_client_id = ?
       ORDER BY n.created_at DESC LIMIT ? OFFSET ?`,
      [clientId, clientId, limit, offset]
    );
    const [countResult] = await db.execute(
      `SELECT COUNT(*) AS totalCount FROM notifications
       WHERE target_type = 'all' OR target_client_id = ?`,
      [clientId]
    );
    const [unreadResult] = await db.execute(
      `SELECT COUNT(*) AS unread FROM notifications n
       LEFT JOIN notification_reads nr ON n.id = nr.notification_id AND nr.client_id = ?
       WHERE (n.target_type = 'all' OR n.target_client_id = ?) AND nr.is_read IS NULL`,
      [clientId, clientId]
    );
    return { status: 'success', data: results, totalCount: countResult[0].totalCount, unread: unreadResult[0].unread };
  },

  markRead: async (notificationId, clientId) => {
    await db.execute(
      `INSERT INTO notification_reads (notification_id, client_id, is_read, created_at)
       VALUES (?, ?, 1, NOW())
       ON DUPLICATE KEY UPDATE is_read = 1`,
      [notificationId, clientId]
    );
    return { status: 'success' };
  },

  markAllRead: async (clientId) => {
    const [notifs] = await db.execute(
      `SELECT id FROM notifications WHERE target_type = 'all' OR target_client_id = ?`,
      [clientId]
    );
    for (const n of notifs) {
      await db.execute(
        `INSERT INTO notification_reads (notification_id, client_id, is_read, created_at)
         VALUES (?, ?, 1, NOW())
         ON DUPLICATE KEY UPDATE is_read = 1`,
        [n.id, clientId]
      );
    }
    return { status: 'success' };
  },

  delete: async (id) => {
    await db.execute('DELETE FROM notifications WHERE id=?', [id]);
    return { status: 'success' };
  }
};

module.exports = Notifications;
