const express = require('express');
const router = express.Router();
const resetController = require('../controllers/resetController');
const { auth } = require('../middlewares/auth');

// Double-protected — requires admin auth
router.delete('/resetSite', auth, resetController.resetSite);

module.exports = router;
