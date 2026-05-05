const jwt = require('jsonwebtoken');
const db = require('../config/db');

module.exports.clientAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send({ status: 401, msg: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (decoded.type !== 'Client') return res.status(401).send({ status: 401, msg: 'Unauthorized' });

    const [rows] = await db.execute('SELECT * FROM clients WHERE token = ? AND isActive = 1', [token]);
    if (!rows || rows.length === 0) return res.status(401).send({ status: 401, msg: 'Unauthorized' });

    req.clientDetails = { id: rows[0].id, email: rows[0].email, name: rows[0].name };
    next();
  } catch (e) {
    return res.status(401).send({ status: 401, msg: 'Unauthorized' });
  }
};
