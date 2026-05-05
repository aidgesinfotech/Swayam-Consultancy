const Stocks = require('../models/stocksModel');
const xlsx = require('xlsx');
const path = require('path');

exports.createStock = async (req, res) => {
  try {
    const result = await Stocks.create(req.body);
    res.status(201).json({ message: 'Stock created', data: result });
  } catch (err) {
    console.error('Error creating stock:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllStocks = async (req, res) => {
  try {
    const result = await Stocks.getAll();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllStocksByPage = async (req, res) => {
  try {
    const { limit = 10, page = 1, searchtxt = '' } = req.query;
    const result = await Stocks.getAllByPage(Number(limit), Number(page), searchtxt);
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

exports.getStockById = async (req, res) => {
  try {
    const result = await Stocks.getById(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const result = await Stocks.update(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateStockStatus = async (req, res) => {
  try {
    await Stocks.updateStatus(req.params.id, req.body.isActive);
    res.status(200).json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteStock = async (req, res) => {
  try {
    await Stocks.delete(req.params.id);
    res.status(200).json({ message: 'Stock deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    // Expected columns: name, lot_size, qty, expiry_date, strike_price
    const mapped = rows.map(r => ({
      name:         r['name']         || r['Name']         || r['Stock Name'],
      lot_size:     Number(r['lot_size']  || r['Lot Size']  || r['lot size']  || 1),
      qty:          Number(r['qty']       || r['Qty']       || r['Quantity']  || 1),
      expiry_date:  r['expiry_date']  || r['Expiry Date']  || r['expiry']    || null,
      strike_price: Number(r['strike_price'] || r['Strike Price'] || r['Strike'] || 0) || null,
    })).filter(r => r.name);

    await Stocks.bulkUpsert(mapped);
    res.status(200).json({ message: `${mapped.length} stocks processed`, status: 'success' });
  } catch (err) {
    console.error('Excel upload error:', err);
    res.status(500).json({ error: 'Failed to process Excel file' });
  }
};
