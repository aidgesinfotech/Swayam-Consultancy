const Reports = require('../models/reportsModel');
const PDFDocument = require('pdfkit');

exports.getClientReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const clientId = req.clientDetails?.id || req.params.clientId;
    const result = await Reports.getClientReport(clientId, from || null, to || null);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAdminReport = async (req, res) => {
  try {
    const { from, to, client_id } = req.query;
    const result = await Reports.getAdminReport(from || null, to || null, client_id || null);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.downloadPDF = async (req, res) => {
  try {
    const { from, to } = req.query;
    const clientId = req.clientDetails?.id || req.params.clientId;
    const result = await Reports.getClientReport(clientId, from || null, to || null);
    const s = result.summary;

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="report-${clientId}.pdf"`);
    doc.pipe(res);

    doc.fontSize(18).font('Helvetica-Bold').text('Swayam Consultancy', { align: 'center' });
    doc.fontSize(11).font('Helvetica').text('Investment Report', { align: 'center' });
    if (from || to) doc.fontSize(9).text(`Period: ${from || 'All'} to ${to || 'All'}`, { align: 'center' });
    doc.moveDown();

    // Summary
    doc.fontSize(12).font('Helvetica-Bold').text('Summary');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Total Trades: ${s.total_trades}  |  Open: ${s.open_trades}  |  Closed: ${s.closed_trades}`);
    doc.text(`Used Margin: ₹${Number(s.used_margin || 0).toFixed(2)}`);
    doc.text(`Realized P&L: ₹${Number(s.total_realized_pnl || 0).toFixed(2)}`);
    doc.text(`Gross Profit: ₹${Number(s.gross_profit || 0).toFixed(2)}  |  Gross Loss: ₹${Number(s.gross_loss || 0).toFixed(2)}`);
    doc.moveDown();

    // Table header
    doc.fontSize(11).font('Helvetica-Bold').text('Trade Bookings');
    doc.moveDown(0.3);
    doc.fontSize(8).font('Helvetica-Bold');
    const cols = [40, 110, 185, 240, 295, 360, 420, 480];
    doc.text('Date',     cols[0], doc.y, { width: 65, continued: true });
    doc.text('Stock',    0, 0, { width: 70, continued: true });
    doc.text('Type',     0, 0, { width: 50, continued: true });
    doc.text('Qty',      0, 0, { width: 50, continued: true });
    doc.text('Bk Price', 0, 0, { width: 60, continued: true });
    doc.text('Cl Price', 0, 0, { width: 55, continued: true });
    doc.text('P&L',      0, 0, { width: 55, continued: true });
    doc.text('Status',   0, 0, { width: 55 });
    doc.moveDown(0.3);
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.3);

    doc.fontSize(8).font('Helvetica');
    for (const t of result.data) {
      if (doc.y > 700) doc.addPage();
      const y = doc.y;
      doc.text(new Date(t.created_at).toLocaleDateString('en-IN'), cols[0], y, { width: 65, continued: true });
      doc.text(t.symbol || '', 0, 0, { width: 70, continued: true });
      doc.text(t.call_type || '', 0, 0, { width: 50, continued: true });
      doc.text(String(t.quantity), 0, 0, { width: 50, continued: true });
      doc.text(`₹${Number(t.booking_price).toFixed(2)}`, 0, 0, { width: 60, continued: true });
      doc.text(t.closing_price ? `₹${Number(t.closing_price).toFixed(2)}` : '—', 0, 0, { width: 55, continued: true });
      doc.text(t.pnl !== null ? `₹${Number(t.pnl).toFixed(2)}` : '—', 0, 0, { width: 55, continued: true });
      doc.text(t.status || '', 0, 0, { width: 55 });
    }

    doc.end();
  } catch (err) {
    console.error('PDF error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};
