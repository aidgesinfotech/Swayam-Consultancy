const express = require('express');
const router = express.Router();
const tradeCallsCtrl = require('../controllers/tradeCallsController');
const tradeBookingsCtrl = require('../controllers/tradeBookingsController');
const { auth } = require('../middlewares/auth');
const { clientAuth } = require('../middlewares/clientAuth');

// ── Admin routes ──────────────────────────────────────────────────────────────
router.post('/createCall', auth, tradeCallsCtrl.createCall);
router.get('/getAllCalls', auth, tradeCallsCtrl.getAllCalls);
router.get('/getCallById/:id', auth, tradeCallsCtrl.getCallById);
router.put('/updateCall/:id', auth, tradeCallsCtrl.updateCall);
router.put('/toggleActive/:id', auth, tradeCallsCtrl.toggleCallActive);
router.delete('/deleteCall/:id', auth, tradeCallsCtrl.deleteCall);
router.get('/getCallBookings/:id', auth, tradeCallsCtrl.getCallBookings);

// ── Client routes ─────────────────────────────────────────────────────────────
router.get('/myCalls', clientAuth, tradeCallsCtrl.getCallsForClient);
router.get('/myCallDetail/:id', clientAuth, tradeCallsCtrl.getCallByIdForClient);

router.post('/bookTrade', clientAuth, tradeBookingsCtrl.bookTrade);
router.put('/closeTrade/:id', clientAuth, tradeBookingsCtrl.closeTrade);
router.get('/myBookings', clientAuth, tradeBookingsCtrl.getMyBookings);
router.get('/myBookingSummary', clientAuth, tradeBookingsCtrl.getMySummary);
router.get('/myBookingDetail/:id', clientAuth, tradeBookingsCtrl.getBookingById);

module.exports = router;
