const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/loginPageCmsController');
const { auth } = require('../middlewares/auth');

router.get('/get', ctrl.get);               // public — UI needs this on login page
router.put('/update', auth, ctrl.update);   // admin only

module.exports = router;
