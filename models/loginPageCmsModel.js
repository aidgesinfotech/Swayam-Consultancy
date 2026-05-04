const db = require('../config/db');

const LoginPageCms = {
  get: async () => {
    const [rows] = await db.execute('SELECT * FROM login_page_cms WHERE id = 1');
    return rows[0] || null;
  },

  update: async (data) => {
    await db.execute(
      `UPDATE login_page_cms SET
        heading = ?, subheading = ?,
        feature1 = ?, feature2 = ?, feature3 = ?,
        logo = ?, bg_color = ?,
        enable_register = ?,
        updated_at = NOW()
       WHERE id = 1`,
      [
        data.heading       || 'Track. Analyse. Grow.',
        data.subheading    || 'Your complete investment tracking platform.',
        data.feature1      || 'Real-time Portfolio Tracking',
        data.feature2      || 'Auto P&L Calculation',
        data.feature3      || 'PDF Reports',
        data.logo          || null,
        data.bg_color      || null,
        data.enable_register ? 1 : 0,
      ]
    );
    return LoginPageCms.get();
  },
};

module.exports = LoginPageCms;
