const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const { auth } = require('../middlewares/auth');
const { clientAuth } = require('../middlewares/clientAuth');

// Admin routes
router.post('/createNotification', auth, notificationsController.createNotification);
router.get('/getAllNotifications', auth, notificationsController.getAllNotifications);
router.delete('/deleteNotification/:id', auth, notificationsController.deleteNotification);

// Client routes
router.get('/myNotifications', clientAuth, notificationsController.getMyNotifications);
router.put('/markRead/:id', clientAuth, notificationsController.markRead);
router.put('/markAllRead', clientAuth, notificationsController.markAllRead);

module.exports = router;
