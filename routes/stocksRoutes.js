const express = require('express');
const router = express.Router();
const multer = require('multer');
const stocksController = require('../controllers/stocksController');
const { auth } = require('../middlewares/auth');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/createStock', auth, stocksController.createStock);
router.get('/getAllStocks', stocksController.getAllStocks); // public for UI dropdown
router.get('/getAllStocksByPage', auth, stocksController.getAllStocksByPage);
router.get('/getStockById/:id', auth, stocksController.getStockById);
router.put('/updateStock/:id', auth, stocksController.updateStock);
router.put('/updateStockStatus/:id', auth, stocksController.updateStockStatus);
router.delete('/deleteStock/:id', auth, stocksController.deleteStock);
router.post('/uploadExcel', auth, upload.single('file'), stocksController.uploadExcel);

module.exports = router;
