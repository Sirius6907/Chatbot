import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Conversation from '../models/Conversation.js';
import getAIResponse from '../utils/deepseekApi.js';

const router = express.Router();

// @route   POST /api/chat/send
// @desc    Send a message to the AI and get a response
// @access  Private
router.post('/send', authenticate, async (req, res) => {
  try {
    const { message, conversationId, useCase } = req.body;
    const userId = req.user?._id;

    console.log('Incoming message:', message);
    console.log('conversationId:', conversationId);
    console.log('useCase:', useCase);
    console.log('userId:', userId);

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message content is required' });
    }

    let conversation;

    if (conversationId) {
      // Find existing conversation
      conversation = await Conversation.findOne({ _id: conversationId, userId });

      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
    } else {
      // Create new conversation
      conversation = new Conversation({
        userId,
        useCase: useCase || 'Default',
        messages: [],
      });
    }

    // Add user's message
    conversation.messages.push({ role: 'user', content: message });

    // Generate AI response
    const aiResponse = await getAIResponse(
      conversation.messages.map(m => ({ role: m.role, content: m.content })),
      conversation.useCase
    );

    if (!aiResponse || typeof aiResponse !== 'string') {
      throw new Error('AI response is invalid');
    }

    // Add assistant's reply
    conversation.messages.push({ role: 'assistant', content: aiResponse });

    // Save updated conversation
    await conversation.save();

    return res.status(200).json({
      message: aiResponse,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error('Chat send error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// @route   GET /api/chat/conversations
// @desc    Get all conversations for a user
// @access  Private
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/conversation/:id
// @desc    Get a specific conversation by ID
// @access  Private
router.get('/conversation/:id', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
