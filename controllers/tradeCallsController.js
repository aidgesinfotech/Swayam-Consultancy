const TradeCalls = require('../models/tradeCallsModel');
const TradeBookings = require('../models/tradeBookingsModel');
const db = require('../config/db');

// ── Admin ────────────────────────────────────────────────────────────────────
exports.createCall = async (req, res) => {
  try {
    const result = await TradeCalls.create(req.body);

    // Auto-generate notification for all clients
    const { stock_id, call_type, recommended_price, description } = req.body;

    // Get stock name for the notification message
    const [stockRows] = await db.execute('SELECT name FROM stocks WHERE id = ?', [stock_id]);
    const stock = stockRows[0];
    const stockLabel = stock ? stock.name : 'a stock';
    const priceLabel = recommended_price ? ` at ₹${Number(recommended_price).toFixed(2)}` : '';
    const descLabel = description ? ` — ${description}` : '';

    const title = `New ${call_type} Call: ${stockLabel}`;
    const message = `A new ${call_type} trade call has been posted for ${stockLabel}${priceLabel}.${descLabel} Tap to view and book your trade.`;

    await db.execute(
      `INSERT INTO notifications (title, message, target_type, target_client_id, created_at, updated_at)
       VALUES (?, ?, 'all', NULL, NOW(), NOW())`,
      [title, message]
    );

    res.status(201).json({ message: 'Trade call created', data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllCalls = async (req, res) => {
  try {
    const { limit = 10, page = 1, searchtxt = '', is_active = '' } = req.query;
    const result = await TradeCalls.getAllByPage(Number(limit), Number(page), searchtxt, is_active === '' ? undefined : Number(is_active));
    res.status(200).json({
      status: 'success',
      data: result.data,
      totalCount: result.totalCount,
      totalPages: Math.ceil(result.totalCount / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCallById = async (req, res) => {
  try {
    const result = await TradeCalls.getById(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateCall = async (req, res) => {
  try {
    await TradeCalls.update(req.params.id, req.body);
    res.status(200).json({ message: 'Trade call updated' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.toggleCallActive = async (req, res) => {
  try {
    await TradeCalls.toggleActive(req.params.id, req.body.is_active);
    res.status(200).json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteCall = async (req, res) => {
  try {
    await TradeCalls.delete(req.params.id);
    res.status(200).json({ message: 'Trade call deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCallBookings = async (req, res) => {
  try {
    const result = await TradeBookings.getByCallId(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Client ───────────────────────────────────────────────────────────────────
exports.getCallsForClient = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const result = await TradeCalls.getAllForClient(req.clientDetails.id, Number(limit), Number(page));
    res.status(200).json({
      status: 'success',
      data: result.data,
      totalCount: result.totalCount,
      totalPages: Math.ceil(result.totalCount / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCallByIdForClient = async (req, res) => {
  try {
    const result = await TradeCalls.getByIdForClient(req.params.id, req.clientDetails.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
