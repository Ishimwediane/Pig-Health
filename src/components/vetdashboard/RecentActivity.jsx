import React from 'react';
import { FaCalendarAlt, FaUser, FaPiggyBank, FaSyringe, FaFileMedical } from 'react-icons/fa';

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'visit':
        return <FaCalendarAlt className="text-blue-500" />;
      case 'vaccination':
        return <FaSyringe className="text-green-500" />;
      case 'health_record':
        return <FaFileMedical className="text-purple-500" />;
      case 'service_request':
        return <FaPiggyBank className="text-orange-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderActivityInfo = (activity) => {
    const info = [];
    info.push(<span key="date">{formatDate(activity.created_at)}</span>);
    
    if (activity.farmer) {
      info.push(
        <span key="farmer" className="mx-2">•</span>,
        <span key="farmer-name">Farmer: {activity.farmer.name}</span>
      );
    }
    
    if (activity.pig) {
      info.push(
        <span key="pig" className="mx-2">•</span>,
        <span key="pig-name">Pig: {activity.pig.name}</span>
      );
    }
    
    return info;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
      <div className="space-y-4">
        {activities && activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.description}
                </p>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  {renderActivityInfo(activity)}
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                  activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  activity.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recent activities found
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity; 