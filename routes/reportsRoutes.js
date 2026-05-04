const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { auth } = require('../middlewares/auth');
const { clientAuth } = require('../middlewares/clientAuth');

// Admin routes
router.get('/adminReport', auth, reportsController.getAdminReport);
router.get('/downloadPDF/:clientId', auth, reportsController.downloadPDF);

// Client routes
router.get('/myReport', clientAuth, reportsController.getClientReport);
router.get('/myPDF', clientAuth, reportsController.downloadPDF);

module.exports = router;
