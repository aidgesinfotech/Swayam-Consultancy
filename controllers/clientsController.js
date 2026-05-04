const jwt = require('jsonwebtoken');
const Clients = require('../models/clientsModel');

exports.createClient = async (req, res) => {
  try {
    const existing = await Clients.findByEmail(req.body.email);
    if (existing.data) return res.status(409).json({ error: 'Email already registered' });
    const result = await Clients.create(req.body);
    res.status(201).json({ message: 'Client created', data: result });
  } catch (err) {
    console.error('Error creating client:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const result = await Clients.getAll();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllClientsByPage = async (req, res) => {
  try {
    const { limit = 10, page = 1, searchtxt = '' } = req.query;
    const result = await Clients.getAllByPage(Number(limit), Number(page), searchtxt);
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

exports.getClientById = async (req, res) => {
  try {
    const result = await Clients.getById(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const result = await Clients.update(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateClientStatus = async (req, res) => {
  try {
    await Clients.updateStatus(req.params.id, req.body.isActive);
    res.status(200).json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    await Clients.delete(req.params.id);
    res.status(200).json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await Clients.findByEmail(email);
    if (!client.data) return res.status(404).json({ error: 'Client not found' });
    if (password !== client.data.password) return res.status(401).json({ error: 'Invalid credentials' });
    if (!client.data.isActive) return res.status(403).json({ error: 'Account is inactive' });

    const token = jwt.sign({ id: client.data.id, type: 'Client' }, process.env.JWT_KEY);
    await Clients.updateToken(client.data.id, token);

    const { password: _, token: __, ...safeData } = client.data;
    res.status(200).json({ message: 'Login successful', client: safeData, token });
  } catch (err) {
    console.error('Client login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.registerClient = async (req, res) => {
  try {
    const existing = await Clients.findByEmail(req.body.email);
    if (existing.data) return res.status(409).json({ error: 'Email already registered' });
    await Clients.create({ ...req.body, isActive: 0 }); // pending approval
    res.status(201).json({ message: 'Registration successful. Awaiting admin approval.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const result = await Clients.getById(req.clientDetails.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const result = await Clients.update(req.clientDetails.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
