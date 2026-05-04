const LoginPageCms = require('../models/loginPageCmsModel');

exports.get = async (req, res) => {
  try {
    const data = await LoginPageCms.get();
    res.status(200).json({ status: 'success', data });
  } catch (err) {
    console.error('LoginPageCms get error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await LoginPageCms.update(req.body);
    res.status(200).json({ status: 'success', data, message: 'Login page updated' });
  } catch (err) {
    console.error('LoginPageCms update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
