import React, { useState, useEffect } from 'react';
import { getPosts } from '../../services/adminService';
import { FaEye, FaThumbsUp, FaComment, FaFlag } from 'react-icons/fa';

const AdminPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPosts();
      console.log('Posts response:', response);
      setPosts(response);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'Not set';
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  const handleViewDetails = (post) => {
    setSelectedPost(post);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Community Posts</h1>
          <p className="text-gray-600">View and manage community posts</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{post.user?.name}</td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate">
                      {post.content}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaThumbsUp className="text-gray-400 mr-1" />
                      {post.likes?.length || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaComment className="text-gray-400 mr-1" />
                      {post.comments?.length || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaFlag className="text-red-400 mr-1" />
                      {post.reports?.length || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDateTime(post.created_at)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(post)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No posts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedPost && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Post Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Author</label>
                  <p className="mt-1 text-sm text-gray-900">
                    Name: {selectedPost.user?.name}<br />
                    ID: {selectedPost.user?.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedPost.content}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Engagement</label>
                  <p className="mt-1 text-sm text-gray-900">
                    Likes: {selectedPost.likes?.length || 0}<br />
                    Comments: {selectedPost.comments?.length || 0}<br />
                    Reports: {selectedPost.reports?.length || 0}
                  </p>
                </div>
                {selectedPost.comments && selectedPost.comments.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Comments</label>
                    <div className="mt-1 space-y-2">
                      {selectedPost.comments.map((comment, index) => (
                        <div key={index} className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                          <p className="font-medium">{comment.user?.name}</p>
                          <p>{comment.content}</p>
                          <p className="text-xs text-gray-500">{formatDateTime(comment.created_at)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedPost.reports && selectedPost.reports.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reports</label>
                    <div className="mt-1 space-y-2">
                      {selectedPost.reports.map((report, index) => (
                        <div key={index} className="text-sm text-gray-900 bg-red-50 p-2 rounded">
                          <p className="font-medium">Reported by: {report.user?.name}</p>
                          <p>Reason: {report.reason}</p>
                          <p className="text-xs text-gray-500">{formatDateTime(report.created_at)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Posted At</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDateTime(selectedPost.created_at)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDateTime(selectedPost.updated_at)}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPost; 