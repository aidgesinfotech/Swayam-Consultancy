const Transactions = require('../models/transactionsModel');

exports.createTransaction = async (req, res) => {
  try {
    const data = { ...req.body, client_id: req.clientDetails?.id || req.body.client_id };
    const result = await Transactions.create(data);
    res.status(201).json({ message: 'Transaction created', data: result });
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.adminCreateTransaction = async (req, res) => {
  try {
    const result = await Transactions.create(req.body);
    res.status(201).json({ message: 'Transaction created', data: result });
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMyTransactions = async (req, res) => {
  try {
    const { limit = 10, page = 1, type = '' } = req.query;
    const result = await Transactions.getAllByClient(req.clientDetails.id, Number(limit), Number(page), type || null);
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

exports.getAllTransactions = async (req, res) => {
  try {
    const { limit = 10, page = 1, searchtxt = '', client_id = '' } = req.query;
    const result = await Transactions.getAllByPage(Number(limit), Number(page), searchtxt, client_id || null);
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

exports.getTransactionById = async (req, res) => {
  try {
    const result = await Transactions.getById(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    await Transactions.update(req.params.id, req.body);
    res.status(200).json({ message: 'Transaction updated' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    await Transactions.delete(req.params.id);
    res.status(200).json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMyPortfolio = async (req, res) => {
  try {
    const result = await Transactions.getPortfolioByClient(req.clientDetails.id);
    const data = result.data.map(item => {
      const investedValue = item.holding_qty * item.avg_buy_price;
      return { ...item, invested_value: investedValue, pnl: 0, pnl_percent: 0 };
    });
    res.status(200).json({ status: 'success', data });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getClientPortfolio = async (req, res) => {
  try {
    const result = await Transactions.getPortfolioByClient(req.params.clientId);
    const data = result.data.map(item => {
      const investedValue = item.holding_qty * item.avg_buy_price;
      return { ...item, invested_value: investedValue, pnl: 0, pnl_percent: 0 };
    });
    res.status(200).json({ status: 'success', data });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMySummary = async (req, res) => {
  try {
    const result = await Transactions.getSummaryByClient(req.clientDetails.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
