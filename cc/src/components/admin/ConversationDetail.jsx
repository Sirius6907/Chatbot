import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { HiArrowLeft } from 'react-icons/hi';

const ConversationDetail = () => {
  const { id } = useParams();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch conversation details on component mount
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await axios.get(`/api/admin/conversation/${id}`);
        setConversation(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch conversation');
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [id]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <h2 className="text-red-800 font-medium">Error</h2>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin/conversations" className="inline-flex items-center text-indigo-600 hover:text-indigo-900">
          <HiArrowLeft className="mr-2" /> Back to Conversations
        </Link>
      </div>

      {conversation ? (
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2">Conversation Details</h1>
                <p className="text-gray-500 mb-4">
                  ID: <span className="font-mono text-xs">{conversation._id}</span>
                </p>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {conversation.useCase}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">User Information</h3>
                  <p className="mt-1">
                    <span className="font-medium">Name:</span>{' '}
                    {conversation.userId?.name || 'Unknown'}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{' '}
                    {conversation.userId?.email || 'Unknown'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Conversation Information</h3>
                  <p className="mt-1">
                    <span className="font-medium">Created:</span>{' '}
                    {formatDate(conversation.createdAt)}
                  </p>
                  <p>
                    <span className="font-medium">Updated:</span>{' '}
                    {formatDate(conversation.updatedAt)}
                  </p>
                  <p>
                    <span className="font-medium">Messages:</span>{' '}
                    {conversation.messages?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Conversation Messages</h2>
            </div>

            <div className="p-4">
              {conversation.messages && conversation.messages.length > 0 ? (
                <div className="space-y-4">
                  {conversation.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-indigo-500 text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <div className="text-xs font-medium mb-1">
                          {message.role === 'user' ? 'User' : 'AI Assistant'}
                        </div>
                        <div className="text-sm mb-1">{message.content}</div>
                        <div
                          className={`text-xs ${
                            message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                          }`}
                        >
                          {formatDate(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">No messages in this conversation</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-md">
          <h2 className="text-yellow-800 font-medium">Not Found</h2>
          <p className="text-yellow-700">Conversation not found</p>
        </div>
      )}
    </div>
  );
};

export default ConversationDetail;
