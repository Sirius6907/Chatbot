import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineLogout, HiOutlineHome, HiOutlineUsers, HiOutlineChatAlt2, HiOutlineChartBar } from 'react-icons/hi';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle back to chat
  const handleBackToChat = () => {
    navigate('/');
  };

  // Navigation items
  const navItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      path: '/admin',
      icon: <HiOutlineChartBar className="w-5 h-5" />
    },
    {
      id: 'users',
      name: 'Users',
      path: '/admin/users',
      icon: <HiOutlineUsers className="w-5 h-5" />
    },
    {
      id: 'conversations',
      name: 'Conversations',
      path: '/admin/conversations',
      icon: <HiOutlineChatAlt2 className="w-5 h-5" />
    }
  ];

  return (
    <div className="w-64 bg-white h-screen flex flex-col border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
      </div>

      <div className="flex-1 p-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <span className="mr-3 text-gray-500">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleBackToChat}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md mb-2"
        >
          <span className="mr-3 text-gray-500">
            <HiOutlineHome className="w-5 h-5" />
          </span>
          Back to Chat
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <span className="mr-3 text-gray-500">
            <HiOutlineLogout className="w-5 h-5" />
          </span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
