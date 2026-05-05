var jwt = require('jsonwebtoken');
const db = require('../config/db');

module.exports.auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).send({ status: 401, msg: "Unauthorized" });
        }

        const secret = process.env.JWT_KEY;
        if (!secret) {
            console.error('JWT_KEY is not defined in environment variables');
            return res.status(500).send({ status: 500, msg: "Server configuration error" });
        }

        const decoded = jwt.verify(token, secret);

        if (!decoded || decoded.type !== 'Administrator User') {
            return res.status(401).send({ status: 401, msg: "Unauthorized" });
        }

        const [rows] = await db.execute(`SELECT * FROM users WHERE token = ?`, [token]);

        if (!rows || rows.length === 0) {
            return res.status(401).send({ status: 401, msg: "Unauthorized" });
        }

        req.userDetails = { data: rows[0], type: decoded.type };
        next();
    } catch (e) {
        console.log(e);
        return res.status(401).send({ status: 401, msg: "Unauthorized" });
    }
};