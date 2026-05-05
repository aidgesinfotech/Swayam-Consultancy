const Reports = require('../models/reportsModel');
const PDFDocument = require('pdfkit');

// ── helpers ───────────────────────────────────────────────────────────────────
const fmt  = (n) => Number(n || 0).toFixed(2);
const fmtN = (n) => Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtD = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '—';
const wr   = (wins, closed) => closed > 0 ? ((wins / closed) * 100).toFixed(1) + '%' : '0%';

function pdfHeader(doc, title, subtitle) {
  doc.fontSize(18).font('Helvetica-Bold').text('Swayam Consultancy', { align: 'center' });
  doc.fontSize(13).font('Helvetica-Bold').text(title, { align: 'center' });
  if (subtitle) doc.fontSize(9).font('Helvetica').text(subtitle, { align: 'center' });
  doc.moveDown(0.5);
  doc.moveTo(30, doc.y).lineTo(565, doc.y).strokeColor('#e5e7eb').stroke();
  doc.moveDown(0.5);
}

function pdfSummaryBlock(doc, rows) {
  doc.fontSize(10).font('Helvetica-Bold').text('Summary', { underline: true });
  doc.moveDown(0.2);
  doc.fontSize(9).font('Helvetica');
  rows.forEach(([label, value]) => {
    doc.text(`${label}: ${value}`);
  });
  doc.moveDown(0.5);
}

function pdfTableHeader(doc, cols) {
  // cols: [{x, w, label}]
  doc.fontSize(7).font('Helvetica-Bold');
  const y = doc.y;
  cols.forEach((c, i) => {
    const continued = i < cols.length - 1;
    if (i === 0) doc.text(c.label, c.x, y, { width: c.w, continued });
    else doc.text(c.label, 0, 0, { width: c.w, continued });
  });
  doc.moveDown(0.2);
  doc.moveTo(30, doc.y).lineTo(565, doc.y).strokeColor('#d1d5db').stroke();
  doc.moveDown(0.2);
}

function pdfTableRow(doc, cols, values) {
  if (doc.y > 740) doc.addPage();
  doc.fontSize(7).font('Helvetica');
  const y = doc.y;
  cols.forEach((c, i) => {
    const continued = i < cols.length - 1;
    const val = String(values[i] ?? '—');
    if (i === 0) doc.text(val, c.x, y, { width: c.w, continued });
    else doc.text(val, 0, 0, { width: c.w, continued });
  });
}

function csvEsc(v) {
  if (v === null || v === undefined) return '—';
  const s = String(v);
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
}

// ── Client report (UI — client's own) ────────────────────────────────────────
exports.getClientReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const clientId = req.clientDetails?.id || req.params.clientId;
    const result = await Reports.getClientReport(clientId, from || null, to || null);
    res.status(200).json(result);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
};

exports.downloadMyPDF = async (req, res) => {
  try {
    const { from, to } = req.query;
    const clientId = req.clientDetails?.id;
    const { data: bookings, summary: s, monthly } = await Reports.getClientReport(clientId, from || null, to || null);

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="my-report.pdf"');
    doc.pipe(res);

    pdfHeader(doc, 'My Investment Report', from || to ? `Period: ${from || 'All'} to ${to || 'All'}` : null);
    pdfSummaryBlock(doc, [
      ['Total Trades', `${s.total_trades} (${s.open_trades} open, ${s.closed_trades} closed)`],
      ['Used Margin', `₹${fmtN(s.used_margin)}`],
      ['Realized P&L', `₹${fmtN(s.total_realized_pnl)}`],
      ['Gross Profit', `₹${fmtN(s.gross_profit)}`],
      ['Gross Loss', `₹${fmtN(s.gross_loss)}`],
      ['Win Rate', wr(s.winning_trades, s.closed_trades)],
      ['Winning Trades', String(s.winning_trades)],
      ['Losing Trades', String(s.losing_trades)],
    ]);

    if (monthly.length) {
      doc.fontSize(10).font('Helvetica-Bold').text('Monthly P&L', { underline: true });
      doc.moveDown(0.2);
      const mc = [{x:30,w:70,label:'Month'},{x:0,w:80,label:'Profit ₹'},{x:0,w:80,label:'Loss ₹'},{x:0,w:80,label:'Net P&L ₹'},{x:0,w:50,label:'Trades'}];
      pdfTableHeader(doc, mc);
      monthly.forEach(m => pdfTableRow(doc, mc, [m.month, fmtN(m.profit), fmtN(m.loss), fmtN(m.net_pnl), m.trades]));
      doc.moveDown(0.5);
    }

    doc.addPage();
    doc.fontSize(10).font('Helvetica-Bold').text('All Trade Bookings', { underline: true });
    doc.moveDown(0.2);
    const bc = [
      {x:30,w:90,label:'Stock'},{x:0,w:35,label:'Type'},{x:0,w:50,label:'Platform'},
      {x:0,w:55,label:'Bk Price ₹'},{x:0,w:35,label:'Qty'},{x:0,w:30,label:'Lots'},
      {x:0,w:55,label:'Cl Price ₹'},{x:0,w:55,label:'P&L ₹'},{x:0,w:40,label:'Status'},{x:0,w:50,label:'Date'}
    ];
    pdfTableHeader(doc, bc);
    bookings.forEach(b => pdfTableRow(doc, bc, [
      b.stock_name, b.call_type, b.platform||'—',
      fmtN(b.booking_price), b.quantity, b.lots||'—',
      b.closing_price ? fmtN(b.closing_price) : '—',
      b.pnl !== null ? fmtN(b.pnl) : '—',
      b.status, fmtD(b.created_at)
    ]));
    doc.end();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to generate PDF' }); }
};

exports.downloadMyCSV = async (req, res) => {
  try {
    const { from, to } = req.query;
    const clientId = req.clientDetails?.id;
    const { data: bookings, summary: s, monthly } = await Reports.getClientReport(clientId, from || null, to || null);

    let csv = `My Investment Report\n`;
    csv += `Period,${from || 'All'} to ${to || 'All'}\n\n`;
    csv += `Summary\n`;
    csv += `Total Trades,${s.total_trades}\nOpen Trades,${s.open_trades}\nClosed Trades,${s.closed_trades}\n`;
    csv += `Used Margin,₹${fmt(s.used_margin)}\nRealized P&L,₹${fmt(s.total_realized_pnl)}\n`;
    csv += `Gross Profit,₹${fmt(s.gross_profit)}\nGross Loss,₹${fmt(s.gross_loss)}\n`;
    csv += `Winning Trades,${s.winning_trades}\nLosing Trades,${s.losing_trades}\nWin Rate,${wr(s.winning_trades, s.closed_trades)}\n\n`;

    if (monthly.length) {
      csv += `Monthly P&L\nMonth,Profit ₹,Loss ₹,Net P&L ₹,Trades\n`;
      monthly.forEach(m => { csv += `${m.month},${fmt(m.profit)},${fmt(m.loss)},${fmt(m.net_pnl)},${m.trades}\n`; });
      csv += `\n`;
    }

    csv += `All Trade Bookings\n`;
    csv += `Sr,Stock,Call Type,Platform,Booking Price ₹,Quantity,Lots,Rec. Price ₹,Target ₹,Closing Price ₹,P&L ₹,Status,Notes,Booked On,Closed On\n`;
    bookings.forEach((b, i) => {
      csv += `${i+1},${csvEsc(b.stock_name)},${b.call_type},${csvEsc(b.platform)},${fmt(b.booking_price)},${b.quantity},${b.lots||'—'},${fmt(b.recommended_price)},${b.target_price?fmt(b.target_price):'—'},${b.closing_price?fmt(b.closing_price):'—'},${b.pnl!==null?fmt(b.pnl):'—'},${b.status},${csvEsc(b.notes)},${fmtD(b.created_at)},${b.status==='closed'?fmtD(b.updated_at):'—'}\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="my-report.csv"');
    res.send('\uFEFF' + csv);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to generate CSV' }); }
};

// ── Admin report ──────────────────────────────────────────────────────────────
exports.getAdminReport = async (req, res) => {
  try {
    const { from, to, client_id } = req.query;
    const result = await Reports.getAdminReport(from || null, to || null, client_id || null);
    res.status(200).json(result);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
};

exports.downloadAdminPDF = async (req, res) => {
  try {
    const { from, to, client_id } = req.query;
    const { data: bookings, summary: s, monthly } = await Reports.getAdminReport(from || null, to || null, client_id || null);

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="admin-report.pdf"');
    doc.pipe(res);

    pdfHeader(doc, 'Admin Trade Report', from || to ? `Period: ${from || 'All'} to ${to || 'All'}` : null);
    pdfSummaryBlock(doc, [
      ['Total Trades', `${s.total_trades} (${s.open_trades} open, ${s.closed_trades} closed)`],
      ['Used Margin', `₹${fmtN(s.used_margin)}`],
      ['Realized P&L', `₹${fmtN(s.total_realized_pnl)}`],
      ['Gross Profit', `₹${fmtN(s.gross_profit)}`],
      ['Gross Loss', `₹${fmtN(s.gross_loss)}`],
      ['Win Rate', wr(s.winning_trades, s.closed_trades)],
    ]);

    if (monthly.length) {
      doc.fontSize(10).font('Helvetica-Bold').text('Monthly P&L', { underline: true });
      doc.moveDown(0.2);
      const mc = [{x:30,w:70,label:'Month'},{x:0,w:80,label:'Profit ₹'},{x:0,w:80,label:'Loss ₹'},{x:0,w:80,label:'Net P&L ₹'},{x:0,w:50,label:'Trades'}];
      pdfTableHeader(doc, mc);
      monthly.forEach(m => pdfTableRow(doc, mc, [m.month, fmtN(m.profit), fmtN(m.loss), fmtN(m.net_pnl), m.trades]));
      doc.moveDown(0.5);
    }

    doc.addPage();
    doc.fontSize(10).font('Helvetica-Bold').text('All Trade Bookings', { underline: true });
    doc.moveDown(0.2);
    const bc = [
      {x:30,w:75,label:'Client'},{x:0,w:75,label:'Stock'},{x:0,w:35,label:'Type'},
      {x:0,w:45,label:'Platform'},{x:0,w:50,label:'Bk Price ₹'},{x:0,w:30,label:'Qty'},
      {x:0,w:50,label:'Cl Price ₹'},{x:0,w:50,label:'P&L ₹'},{x:0,w:40,label:'Status'},{x:0,w:45,label:'Date'}
    ];
    pdfTableHeader(doc, bc);
    bookings.forEach(b => pdfTableRow(doc, bc, [
      b.client_name, b.stock_name, b.call_type, b.platform||'—',
      fmtN(b.booking_price), b.quantity,
      b.closing_price ? fmtN(b.closing_price) : '—',
      b.pnl !== null ? fmtN(b.pnl) : '—',
      b.status, fmtD(b.created_at)
    ]));
    doc.end();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to generate PDF' }); }
};

exports.downloadAdminCSV = async (req, res) => {
  try {
    const { from, to, client_id } = req.query;
    const { data: bookings, summary: s, monthly } = await Reports.getAdminReport(from || null, to || null, client_id || null);

    let csv = `Admin Trade Report\nPeriod,${from || 'All'} to ${to || 'All'}\n\n`;
    csv += `Summary\nTotal Trades,${s.total_trades}\nOpen Trades,${s.open_trades}\nClosed Trades,${s.closed_trades}\n`;
    csv += `Used Margin,₹${fmt(s.used_margin)}\nRealized P&L,₹${fmt(s.total_realized_pnl)}\n`;
    csv += `Gross Profit,₹${fmt(s.gross_profit)}\nGross Loss,₹${fmt(s.gross_loss)}\n`;
    csv += `Winning Trades,${s.winning_trades}\nLosing Trades,${s.losing_trades}\nWin Rate,${wr(s.winning_trades, s.closed_trades)}\n\n`;

    if (monthly.length) {
      csv += `Monthly P&L\nMonth,Profit ₹,Loss ₹,Net P&L ₹,Trades\n`;
      monthly.forEach(m => { csv += `${m.month},${fmt(m.profit)},${fmt(m.loss)},${fmt(m.net_pnl)},${m.trades}\n`; });
      csv += `\n`;
    }

    csv += `All Trade Bookings\n`;
    csv += `Sr,Client,Email,Stock,Call Type,Platform,Booking Price ₹,Quantity,Lots,Rec. Price ₹,Target ₹,Closing Price ₹,P&L ₹,Status,Notes,Booked On,Closed On\n`;
    bookings.forEach((b, i) => {
      csv += `${i+1},${csvEsc(b.client_name)},${csvEsc(b.email)},${csvEsc(b.stock_name)},${b.call_type},${csvEsc(b.platform)},${fmt(b.booking_price)},${b.quantity},${b.lots||'—'},${fmt(b.recommended_price)},${b.target_price?fmt(b.target_price):'—'},${b.closing_price?fmt(b.closing_price):'—'},${b.pnl!==null?fmt(b.pnl):'—'},${b.status},${csvEsc(b.notes)},${fmtD(b.created_at)},${b.status==='closed'?fmtD(b.updated_at):'—'}\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="admin-report.csv"');
    res.send('\uFEFF' + csv);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to generate CSV' }); }
};

// ── Client-wise report (admin view) ──────────────────────────────────────────
exports.getClientWiseReport = async (req, res) => {
  try {
    const result = await Reports.getClientWiseReport(req.params.clientId);
    res.status(200).json(result);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
};

exports.downloadClientWisePDF = async (req, res) => {
  try {
    const { client, summary: s, bookings, monthly, stockBreakdown } = await Reports.getClientWiseReport(req.params.clientId);
    if (!client) return res.status(404).json({ error: 'Client not found' });

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="client-${client.name.replace(/\s+/g,'-')}.pdf"`);
    doc.pipe(res);

    pdfHeader(doc, `Client Report: ${client.name}`, `${client.email} | +91 ${client.mobile||'—'} | Joined: ${fmtD(client.created_at)}`);
    pdfSummaryBlock(doc, [
      ['Total Trades', `${s.total_trades} (${s.open_trades} open, ${s.closed_trades} closed)`],
      ['Used Margin', `₹${fmtN(s.used_margin)}`],
      ['Realized P&L', `₹${fmtN(s.total_realized_pnl)}`],
      ['Gross Profit', `₹${fmtN(s.gross_profit)}`],
      ['Gross Loss', `₹${fmtN(s.gross_loss)}`],
      ['Win Rate', wr(s.winning_trades, s.closed_trades)],
      ['Winning Trades', String(s.winning_trades)],
      ['Losing Trades', String(s.losing_trades)],
    ]);

    if (stockBreakdown.length) {
      doc.fontSize(10).font('Helvetica-Bold').text('Stock-wise Breakdown', { underline: true });
      doc.moveDown(0.2);
      const sc = [{x:30,w:110,label:'Stock'},{x:0,w:45,label:'Trades'},{x:0,w:35,label:'Open'},{x:0,w:45,label:'Closed'},{x:0,w:40,label:'Wins'},{x:0,w:40,label:'Losses'},{x:0,w:65,label:'P&L ₹'},{x:0,w:70,label:'Open Margin ₹'}];
      pdfTableHeader(doc, sc);
      stockBreakdown.forEach(s2 => pdfTableRow(doc, sc, [s2.stock_name, s2.total_trades, s2.open_trades, s2.closed_trades, s2.wins, s2.losses, fmtN(s2.total_pnl), fmtN(s2.open_margin)]));
      doc.moveDown(0.5);
    }

    if (monthly.length) {
      doc.fontSize(10).font('Helvetica-Bold').text('Monthly P&L', { underline: true });
      doc.moveDown(0.2);
      const mc = [{x:30,w:70,label:'Month'},{x:0,w:80,label:'Profit ₹'},{x:0,w:80,label:'Loss ₹'},{x:0,w:80,label:'Net P&L ₹'},{x:0,w:50,label:'Trades'}];
      pdfTableHeader(doc, mc);
      monthly.forEach(m => pdfTableRow(doc, mc, [m.month, fmtN(m.profit), fmtN(m.loss), fmtN(m.net_pnl), m.trades]));
      doc.moveDown(0.5);
    }

    doc.addPage();
    doc.fontSize(10).font('Helvetica-Bold').text('All Trade Bookings', { underline: true });
    doc.moveDown(0.2);
    const bc = [
      {x:30,w:80,label:'Stock'},{x:0,w:35,label:'Type'},{x:0,w:50,label:'Platform'},
      {x:0,w:50,label:'Bk Price ₹'},{x:0,w:30,label:'Qty'},{x:0,w:30,label:'Lots'},
      {x:0,w:50,label:'Cl Price ₹'},{x:0,w:50,label:'P&L ₹'},{x:0,w:40,label:'Status'},{x:0,w:50,label:'Date'}
    ];
    pdfTableHeader(doc, bc);
    bookings.forEach(b => pdfTableRow(doc, bc, [
      b.stock_name, b.call_type, b.platform||'—',
      fmtN(b.booking_price), b.quantity, b.lots||'—',
      b.closing_price ? fmtN(b.closing_price) : '—',
      b.pnl !== null ? fmtN(b.pnl) : '—',
      b.status, fmtD(b.created_at)
    ]));
    doc.end();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to generate PDF' }); }
};

exports.downloadClientWiseCSV = async (req, res) => {
  try {
    const { client, summary: s, bookings, monthly, stockBreakdown } = await Reports.getClientWiseReport(req.params.clientId);
    if (!client) return res.status(404).json({ error: 'Client not found' });

    let csv = `Client Report\nName,${csvEsc(client.name)}\nEmail,${client.email}\nMobile,${client.mobile||'—'}\n`;
    csv += `Status,${client.isActive ? 'Active' : 'Inactive'}\nJoined,${fmtD(client.created_at)}\n\n`;
    csv += `Summary\nTotal Trades,${s.total_trades}\nOpen Trades,${s.open_trades}\nClosed Trades,${s.closed_trades}\n`;
    csv += `Used Margin,₹${fmt(s.used_margin)}\nRealized P&L,₹${fmt(s.total_realized_pnl)}\n`;
    csv += `Gross Profit,₹${fmt(s.gross_profit)}\nGross Loss,₹${fmt(s.gross_loss)}\n`;
    csv += `Winning Trades,${s.winning_trades}\nLosing Trades,${s.losing_trades}\nWin Rate,${wr(s.winning_trades, s.closed_trades)}\n\n`;

    if (stockBreakdown.length) {
      csv += `Stock-wise Breakdown\nStock,Total Trades,Open,Closed,Wins,Losses,Total P&L ₹,Open Margin ₹\n`;
      stockBreakdown.forEach(s2 => { csv += `${csvEsc(s2.stock_name)},${s2.total_trades},${s2.open_trades},${s2.closed_trades},${s2.wins},${s2.losses},${fmt(s2.total_pnl)},${fmt(s2.open_margin)}\n`; });
      csv += `\n`;
    }

    if (monthly.length) {
      csv += `Monthly P&L\nMonth,Profit ₹,Loss ₹,Net P&L ₹,Trades\n`;
      monthly.forEach(m => { csv += `${m.month},${fmt(m.profit)},${fmt(m.loss)},${fmt(m.net_pnl)},${m.trades}\n`; });
      csv += `\n`;
    }

    csv += `All Trade Bookings\nSr,Stock,Call Type,Platform,Booking Price ₹,Quantity,Lots,Rec. Price ₹,Target ₹,Closing Price ₹,P&L ₹,Status,Notes,Booked On,Closed On\n`;
    bookings.forEach((b, i) => {
      csv += `${i+1},${csvEsc(b.stock_name)},${b.call_type},${csvEsc(b.platform)},${fmt(b.booking_price)},${b.quantity},${b.lots||'—'},${fmt(b.recommended_price)},${b.target_price?fmt(b.target_price):'—'},${b.closing_price?fmt(b.closing_price):'—'},${b.pnl!==null?fmt(b.pnl):'—'},${b.status},${csvEsc(b.notes)},${fmtD(b.created_at)},${b.status==='closed'?fmtD(b.updated_at):'—'}\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="client-${client.name.replace(/\s+/g,'-')}.csv"`);
    res.send('\uFEFF' + csv);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to generate CSV' }); }
};

// ── Stock-wise report ─────────────────────────────────────────────────────────
exports.getStockWiseReport = async (req, res) => {
  try {
    const result = await Reports.getStockWiseReport(req.params.stockId);
    res.status(200).json(result);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
};

exports.downloadStockWisePDF = async (req, res) => {
  try {
    const { stock, summary: s, calls, bookings } = await Reports.getStockWiseReport(req.params.stockId);
    if (!stock) return res.status(404).json({ error: 'Stock not found' });

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="stock-${stock.name.replace(/\s+/g,'-')}.pdf"`);
    doc.pipe(res);

    const meta = [`Lot Size: ${stock.lot_size}`, stock.expiry_date ? `Expiry: ${fmtD(stock.expiry_date)}` : null, stock.strike_price ? `Strike: ₹${stock.strike_price}` : null].filter(Boolean).join(' | ');
    pdfHeader(doc, `Stock Report: ${stock.name}`, meta);
    pdfSummaryBlock(doc, [
      ['Total Calls', `${s.total_calls} (${s.active_calls} active, ${s.expired_calls} expired)`],
      ['Total Positions', `${s.total_bookings} (${s.open_positions} open, ${s.closed_positions} closed)`],
      ['Realized P&L', `₹${fmtN(s.total_pnl)}`],
      ['Gross Profit', `₹${fmtN(s.gross_profit)}`],
      ['Gross Loss', `₹${fmtN(s.gross_loss)}`],
      ['Win Rate', wr(s.winning_trades, s.closed_positions)],
      ['Open Margin', `₹${fmtN(s.open_margin)}`],
    ]);

    if (calls.length) {
      doc.fontSize(10).font('Helvetica-Bold').text('Calls Breakdown', { underline: true });
      doc.moveDown(0.2);
      const cc = [{x:30,w:35,label:'Type'},{x:0,w:55,label:'Rec ₹'},{x:0,w:55,label:'Target ₹'},{x:0,w:35,label:'Lots'},{x:0,w:45,label:'Status'},{x:0,w:40,label:'Bkgs'},{x:0,w:30,label:'Open'},{x:0,w:35,label:'Closed'},{x:0,w:35,label:'W/L'},{x:0,w:60,label:'P&L ₹'},{x:0,w:50,label:'Date'}];
      pdfTableHeader(doc, cc);
      calls.forEach(c => pdfTableRow(doc, cc, [c.call_type, fmtN(c.recommended_price), c.target_price?fmtN(c.target_price):'—', c.lots||1, c.is_active?'Active':'Expired', c.total_bookings, c.open_bookings, c.closed_bookings, `${c.winning}/${c.losing}`, fmtN(c.total_pnl), fmtD(c.created_at)]));
      doc.moveDown(0.5);
    }

    doc.addPage();
    doc.fontSize(10).font('Helvetica-Bold').text('All Positions', { underline: true });
    doc.moveDown(0.2);
    const bc = [{x:30,w:80,label:'Client'},{x:0,w:35,label:'Type'},{x:0,w:50,label:'Platform'},{x:0,w:55,label:'Bk Price ₹'},{x:0,w:35,label:'Qty'},{x:0,w:30,label:'Lots'},{x:0,w:55,label:'Cl Price ₹'},{x:0,w:55,label:'P&L ₹'},{x:0,w:40,label:'Status'},{x:0,w:50,label:'Date'}];
    pdfTableHeader(doc, bc);
    bookings.forEach(b => pdfTableRow(doc, bc, [b.client_name, b.call_type, b.platform||'—', fmtN(b.booking_price), b.quantity, b.lots||'—', b.closing_price?fmtN(b.closing_price):'—', b.pnl!==null?fmtN(b.pnl):'—', b.status, fmtD(b.created_at)]));
    doc.end();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to generate PDF' }); }
};

exports.downloadStockWiseCSV = async (req, res) => {
  try {
    const { stock, summary: s, calls, bookings } = await Reports.getStockWiseReport(req.params.stockId);
    if (!stock) return res.status(404).json({ error: 'Stock not found' });

    let csv = `Stock Report\nName,${csvEsc(stock.name)}\nLot Size,${stock.lot_size}\n`;
    if (stock.expiry_date) csv += `Expiry Date,${fmtD(stock.expiry_date)}\n`;
    if (stock.strike_price) csv += `Strike Price,₹${stock.strike_price}\n`;
    csv += `Status,${stock.isActive ? 'Active' : 'Inactive'}\n\n`;
    csv += `Summary\nTotal Calls,${s.total_calls}\nActive Calls,${s.active_calls}\nExpired Calls,${s.expired_calls}\n`;
    csv += `Total Positions,${s.total_bookings}\nOpen Positions,${s.open_positions}\nClosed Positions,${s.closed_positions}\n`;
    csv += `Realized P&L,₹${fmt(s.total_pnl)}\nGross Profit,₹${fmt(s.gross_profit)}\nGross Loss,₹${fmt(s.gross_loss)}\n`;
    csv += `Winning Trades,${s.winning_trades}\nLosing Trades,${s.losing_trades}\nWin Rate,${wr(s.winning_trades, s.closed_positions)}\nOpen Margin,₹${fmt(s.open_margin)}\n\n`;

    csv += `Calls Breakdown\nSr,Type,Rec Price ₹,Target ₹,Lots,Status,Total Bookings,Open,Closed,Wins,Losses,Total P&L ₹,Open Margin ₹,Date\n`;
    calls.forEach((c, i) => { csv += `${i+1},${c.call_type},${fmt(c.recommended_price)},${c.target_price?fmt(c.target_price):'—'},${c.lots||1},${c.is_active?'Active':'Expired'},${c.total_bookings},${c.open_bookings},${c.closed_bookings},${c.winning},${c.losing},${fmt(c.total_pnl)},${fmt(c.open_margin)},${fmtD(c.created_at)}\n`; });
    csv += `\n`;

    csv += `All Positions\nSr,Client,Email,Call Type,Platform,Booking Price ₹,Quantity,Lots,Closing Price ₹,P&L ₹,Status,Notes,Booked On,Closed On\n`;
    bookings.forEach((b, i) => { csv += `${i+1},${csvEsc(b.client_name)},${csvEsc(b.client_email)},${b.call_type},${csvEsc(b.platform)},${fmt(b.booking_price)},${b.quantity},${b.lots||'—'},${b.closing_price?fmt(b.closing_price):'—'},${b.pnl!==null?fmt(b.pnl):'—'},${b.status},${csvEsc(b.notes)},${fmtD(b.created_at)},${b.status==='closed'?fmtD(b.updated_at):'—'}\n`; });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="stock-${stock.name.replace(/\s+/g,'-')}.csv"`);
    res.send('\uFEFF' + csv);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to generate CSV' }); }
};
