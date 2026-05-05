const TradeBookings = require('../models/tradeBookingsModel');

// ── Client ───────────────────────────────────────────────────────────────────
exports.bookTrade = async (req, res) => {
  try {
    const clientId = req.clientDetails.id;
    const callId = req.body.call_id;

    // Prevent duplicate booking
    const existing = await TradeBookings.getByCallAndClient(callId, clientId);
    if (existing) return res.status(409).json({ error: 'You have already booked this trade call' });

    const result = await TradeBookings.create({ ...req.body, client_id: clientId });
    res.status(201).json({ message: 'Trade booked successfully', data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.closeTrade = async (req, res) => {
  try {
    const clientId = req.clientDetails.id;
    const booking = await TradeBookings.getById(req.params.id, clientId);
    if (!booking.data) return res.status(404).json({ error: 'Booking not found' });
    if (booking.data.status === 'closed') return res.status(400).json({ error: 'Trade already closed' });

    const result = await TradeBookings.close(req.params.id, clientId, {
      closing_price: req.body.closing_price,
      exit_screenshot: req.body.exit_screenshot || null,
      booking_price: booking.data.booking_price,
      quantity: booking.data.quantity,
    });
    res.status(200).json({ message: 'Trade closed', pnl: result.pnl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const { status = '' } = req.query;
    const result = await TradeBookings.getMyBookings(req.clientDetails.id, status || null);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMySummary = async (req, res) => {
  try {
    const result = await TradeBookings.getMySummary(req.clientDetails.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const result = await TradeBookings.getById(req.params.id, req.clientDetails.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Admin ────────────────────────────────────────────────────────────────────
exports.getAllAdmin = async (req, res) => {
  try {
    const { limit = 15, page = 1, client_id = '', status = '', search = '' } = req.query;
    const result = await TradeBookings.getAllAdmin(
      Number(limit), Number(page),
      client_id || null, status || null, search || null
    );
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
