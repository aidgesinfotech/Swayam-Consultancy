const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportsController');
const { auth } = require('../middlewares/auth');
const { clientAuth } = require('../middlewares/clientAuth');

// ── Admin routes ──────────────────────────────────────────────────────────────
router.get('/adminReport',          auth, ctrl.getAdminReport);
router.get('/adminReportPDF',       auth, ctrl.downloadAdminPDF);
router.get('/adminReportCSV',       auth, ctrl.downloadAdminCSV);

router.get('/clientWiseReport/:clientId', auth, ctrl.getClientWiseReport);
router.get('/clientWisePDF/:clientId',    auth, ctrl.downloadClientWisePDF);
router.get('/clientWiseCSV/:clientId',    auth, ctrl.downloadClientWiseCSV);

router.get('/stockWiseReport/:stockId',   auth, ctrl.getStockWiseReport);
router.get('/stockWisePDF/:stockId',      auth, ctrl.downloadStockWisePDF);
router.get('/stockWiseCSV/:stockId',      auth, ctrl.downloadStockWiseCSV);

// ── Client (UI) routes ────────────────────────────────────────────────────────
router.get('/myReport',  clientAuth, ctrl.getClientReport);
router.get('/myPDF',     clientAuth, ctrl.downloadMyPDF);
router.get('/myCSV',     clientAuth, ctrl.downloadMyCSV);

module.exports = router;
