const Notifications = require('../models/notificationsModel');

exports.createNotification = async (req, res) => {
  try {
    const result = await Notifications.create(req.body);
    res.status(201).json({ message: 'Notification sent', data: result });
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const result = await Notifications.getAllByPage(Number(limit), Number(page));
    res.status(200).json({
      status: 'success',
      data: result.data,
      totalCount: result.totalCount,
      totalPages: Math.ceil(result.totalCount / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMyNotifications = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const result = await Notifications.getForClient(req.clientDetails.id, Number(limit), Number(page));
    res.status(200).json({
      status: 'success',
      data: result.data,
      totalCount: result.totalCount,
      unread: result.unread,
      totalPages: Math.ceil(result.totalCount / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.markRead = async (req, res) => {
  try {
    await Notifications.markRead(req.params.id, req.clientDetails.id);
    res.status(200).json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notifications.markAllRead(req.clientDetails.id);
    res.status(200).json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    await Notifications.delete(req.params.id);
    res.status(200).json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
