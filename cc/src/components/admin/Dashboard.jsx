import { useState, useEffect } from 'react';
import axios from 'axios';
import { HiOutlineUsers, HiOutlineChatAlt2 } from 'react-icons/hi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-700">
              <HiOutlineUsers className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats?.userStats?.totalUsers || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-700">
              <HiOutlineUsers className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Admin Users</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats?.userStats?.totalAdmins || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-700">
              <HiOutlineChatAlt2 className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Conversations</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats?.conversationStats?.total || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Use Case Distribution */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Conversations by Use Case</h2>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          {stats?.conversationStats?.byUseCase?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.conversationStats.byUseCase.map((item) => (
                <div key={item._id} className="flex justify-between items-center p-3 border-b border-gray-100">
                  <span className="font-medium">{item._id}</span>
                  <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-sm">
                    {item.count} conversations
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No conversation data available</p>
          )}
        </div>
      </div>

      {/* Recent Users */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent User Registrations</h2>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats?.recentUsers?.length > 0 ? (
                stats.recentUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No recent users
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
