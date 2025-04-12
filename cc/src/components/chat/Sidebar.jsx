import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { HiHome, HiOutlineLogout } from 'react-icons/hi';
import { FaHospital, FaUniversity, FaShoppingCart, FaChartLine } from 'react-icons/fa';
import { BsBuildingFillCheck } from 'react-icons/bs';

const Sidebar = () => {
  const { logout, isAuthenticated, isAdmin } = useAuth();
  const { activeUseCase, changeUseCase, getConversations } = useChat();
  const navigate = useNavigate();

  // Fetch conversations on component mount
  useEffect(() => {
    if (isAuthenticated) {
      getConversations();
    }
  }, [isAuthenticated, getConversations]);

  // Handle use case selection
  const handleUseCaseChange = (useCase) => {
    changeUseCase(useCase);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle admin dashboard navigation
  const handleAdminDashboard = () => {
    navigate('/admin');
  };

  // Use case options with icons
  const useCases = [
    { id: 'Default', name: 'Default', icon: <HiHome className="w-5 h-5" /> },
    { id: 'Healthcare', name: 'Healthcare', icon: <FaHospital className="w-5 h-5" /> },
    { id: 'Banking', name: 'Banking', icon: <BsBuildingFillCheck className="w-5 h-5" /> },
    { id: 'Education', name: 'Education', icon: <FaUniversity className="w-5 h-5" /> },
    { id: 'E-commerce', name: 'E-commerce', icon: <FaShoppingCart className="w-5 h-5" /> },
    { id: 'Lead Generation', name: 'Lead Generation', icon: <FaChartLine className="w-5 h-5" /> }
  ];

  return (
    <div className="w-64 bg-gray-100 h-screen flex flex-col border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Chatbot</h1>
      </div>

      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          USE CASES
        </h2>
        <nav className="mt-2">
          <ul>
            {useCases.map((useCase) => (
              <li key={useCase.id} className="mb-1">
                <button
                  onClick={() => handleUseCaseChange(useCase.id)}
                  className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                    activeUseCase === useCase.id
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-3 text-gray-500">{useCase.icon}</span>
                  {useCase.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-gray-200">
        {isAdmin && (
          <button
            onClick={handleAdminDashboard}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md mb-2"
          >
            <span className="mr-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            Admin Dashboard
          </button>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md"
        >
          <span className="mr-3">
            <HiOutlineLogout className="w-5 h-5" />
          </span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
