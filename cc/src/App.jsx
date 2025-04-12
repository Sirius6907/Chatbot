import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ChatLayout from './components/chat/ChatLayout';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import UsersList from './components/admin/UsersList';
import ConversationsList from './components/admin/ConversationsList';
import ConversationDetail from './components/admin/ConversationDetail';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <div className="min-h-screen">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Chat Route */}
              <Route path="/" element={<ChatLayout />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UsersList />} />
                <Route path="conversations" element={<ConversationsList />} />
                <Route path="conversation/:id" element={<ConversationDetail />} />
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </div>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
