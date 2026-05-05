const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');
const { auth } = require('../middlewares/auth');
const { clientAuth } = require('../middlewares/clientAuth');

// Admin routes
router.post('/createClient', auth, clientsController.createClient);
router.get('/getAllClients', auth, clientsController.getAllClients);
router.get('/getAllClientsByPage', auth, clientsController.getAllClientsByPage);
router.get('/getClientById/:id', auth, clientsController.getClientById);
router.put('/updateClient/:id', auth, clientsController.updateClient);
router.put('/updateClientStatus/:id', auth, clientsController.updateClientStatus);
router.delete('/deleteClient/:id', auth, clientsController.deleteClient);

// Client auth routes
router.post('/loginClient', clientsController.loginClient);
router.post('/registerClient', clientsController.registerClient);

// Client self routes
router.get('/myProfile', clientAuth, clientsController.getMyProfile);
router.put('/updateMyProfile', clientAuth, clientsController.updateMyProfile);

module.exports = router;
