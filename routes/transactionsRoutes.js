const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');
const { auth } = require('../middlewares/auth');
const { clientAuth } = require('../middlewares/clientAuth');

// Admin routes
router.post('/adminCreateTransaction', auth, transactionsController.adminCreateTransaction);
router.get('/getAllTransactions', auth, transactionsController.getAllTransactions);
router.get('/getTransactionById/:id', auth, transactionsController.getTransactionById);
router.put('/updateTransaction/:id', auth, transactionsController.updateTransaction);
router.delete('/deleteTransaction/:id', auth, transactionsController.deleteTransaction);
router.get('/getClientPortfolio/:clientId', auth, transactionsController.getClientPortfolio);

// Client routes
router.post('/createTransaction', clientAuth, transactionsController.createTransaction);
router.get('/myTransactions', clientAuth, transactionsController.getMyTransactions);
router.get('/myPortfolio', clientAuth, transactionsController.getMyPortfolio);
router.get('/mySummary', clientAuth, transactionsController.getMySummary);

module.exports = router;
