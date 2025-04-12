import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to check admin access
router.use(authenticate, isAdmin);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/conversations
// @desc    Get all conversations
// @access  Admin
router.get('/conversations', async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate('userId', 'name email')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error('Admin get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/conversation/:id
// @desc    Get a specific conversation
// @access  Admin
router.get('/conversation/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('userId', 'name email');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Admin get conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalConversations = await Conversation.countDocuments();

    // Get counts by use case
    const useCaseCounts = await Conversation.aggregate([
      { $group: { _id: '$useCase', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get recent user registrations
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      userStats: {
        totalUsers,
        totalAdmins
      },
      conversationStats: {
        total: totalConversations,
        byUseCase: useCaseCounts
      },
      recentUsers
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
