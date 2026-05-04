const db = require('../config/db');

exports.resetSite = async (req, res) => {
  try {
    // Hard delete in correct order (FK constraints)
    await db.execute('DELETE FROM notification_reads');
    await db.execute('DELETE FROM notifications');
    await db.execute('DELETE FROM trade_bookings');
    await db.execute('DELETE FROM trade_calls');
    await db.execute('DELETE FROM transactions');
    await db.execute('DELETE FROM clients');
    await db.execute('DELETE FROM stocks');

    // Reset auto-increment counters
    await db.execute('ALTER TABLE notification_reads AUTO_INCREMENT = 1');
    await db.execute('ALTER TABLE notifications AUTO_INCREMENT = 1');
    await db.execute('ALTER TABLE trade_bookings AUTO_INCREMENT = 1');
    await db.execute('ALTER TABLE trade_calls AUTO_INCREMENT = 1');
    await db.execute('ALTER TABLE transactions AUTO_INCREMENT = 1');
    await db.execute('ALTER TABLE clients AUTO_INCREMENT = 1');
    await db.execute('ALTER TABLE stocks AUTO_INCREMENT = 1');

    res.status(200).json({ status: 'success', message: 'Site data reset successfully. Admin users and site config preserved.' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ error: 'Reset failed: ' + err.message });
  }
};
