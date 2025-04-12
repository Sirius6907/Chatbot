import { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeUseCase, setActiveUseCase] = useState('Default');

  // Get all conversations
  const getConversations = async () => {
    if (!isAuthenticated) return;

    setLoading(false);
    try {
      const res = await axios.get('/api/chat/conversations');
      setConversations(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  // Get a specific conversation
  const getConversation = async (id) => {
    if (!isAuthenticated) return;

    setLoading(false);
    try {
      const res = await axios.get(`/api/chat/conversation/${id}`);
      setCurrentConversation(res.data);
      setMessages(res.data.messages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch conversation');
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (message) => {
    if (!isAuthenticated || !message.trim()) return;

    setLoading(false);
    const timestamp = new Date();
    const tempMessageId = Date.now(); // Temporary ID for optimistic update

    try {
      // Optimistic update for user message
      const newUserMessage = {
        id: tempMessageId,
        role: 'user',
        content: message,
        timestamp,
        isOptimistic: true
      };
      setMessages(prev => [...prev, newUserMessage]);

      // API call to send message
      const res = await axios.post('/api/chat/send', {
        message,
        conversationId: currentConversation?._id,
        useCase: activeUseCase
      });

      // Replace optimistic message with confirmed message from server
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== tempMessageId),
        {
          id: res.data.messageId || Date.now(),
          role: 'user',
          content: message,
          timestamp
        }
      ]);

      // Add AI response
      const aiMessage = {
        id: res.data.responseId || Date.now() + 1,
        role: 'assistant',
        content: res.data.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

      // Handle new conversation case
      if (!currentConversation && res.data.conversationId) {
        const newConversation = {
          _id: res.data.conversationId,
          useCase: activeUseCase,
          messages: [
            { ...newUserMessage, isOptimistic: undefined },
            aiMessage
          ]
        };
        setCurrentConversation(newConversation);
        await getConversations();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessageId));
    } finally {
      setLoading(false);
    }
  };

  // Change active use case
  const changeUseCase = (useCase) => {
    setActiveUseCase(useCase);
    setCurrentConversation(null);
    setMessages([]);
  };

  // Clear current conversation
  const clearConversation = () => {
    setCurrentConversation(null);
    setMessages([]);
  };

  // Clear error
  const clearError = () => setError(null);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        loading,
        error,
        activeUseCase,
        getConversations,
        getConversation,
        sendMessage,
        changeUseCase,
        clearConversation,
        clearError
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};