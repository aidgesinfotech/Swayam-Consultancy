require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const fileuploadRoutes = require("./routes/fileuploadRoutes");
const usersRoutes = require('./routes/usersRoutes');
const siteconfigRoutes = require('./routes/siteconfigRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const stocksRoutes = require('./routes/stocksRoutes');
const clientsRoutes = require('./routes/clientsRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');
const notificationsRoutes = require('./routes/notificationsRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const loginPageCmsRoutes = require('./routes/loginPageCmsRoutes');
const tradeCallsRoutes = require('./routes/tradeCallsRoutes');
const resetRoutes = require('./routes/resetRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));

app.use("/api/file", fileuploadRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/siteconfig', siteconfigRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/stocks', stocksRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/login-page-cms', loginPageCmsRoutes);
app.use('/api/trade-calls', tradeCallsRoutes);
app.use('/api/reset', resetRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});