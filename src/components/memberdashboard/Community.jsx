import React, { useEffect, useState } from 'react';
import {
  getAllPosts,
  createPost,
  likePost,
  commentOnPost,
  reportPost
} from '../../services/chatServices';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [reportData, setReportData] = useState({
    abuse_type: 'spam',
    comment: ''
  });

  const abuseTypes = [
    { value: 'spam', label: 'Spam' },
    { value: 'inappropriate_content', label: 'Inappropriate Content' },
    { value: 'harassment', label: 'Harassment' },
    { value: 'hate_speech', label: 'Hate Speech' },
    { value: 'violence', label: 'Violence' },
    { value: 'other', label: 'Other' }
  ];

  const fetchPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!newContent.trim()) return;
    try {
      await createPost(newContent);
      setNewContent('');
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      fetchPosts();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (postId) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    try {
      await commentOnPost(postId, content);
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      fetchPosts();
    } catch (err) {
      console.error('Error commenting:', err);
    }
  };

  const handleReport = async (postId) => {
    setSelectedPostId(postId);
    setShowReportModal(true);
  };

  const handleReportSubmit = async () => {
    if (!reportData.comment.trim()) {
      alert('Please provide details about the report');
      return;
    }

    try {
      await reportPost(selectedPostId, reportData.comment, reportData.abuse_type);
      setShowReportModal(false);
      setReportData({ abuse_type: 'spam', comment: '' });
      alert("Post reported successfully.");
    } catch (err) {
      console.error("Error reporting post:", err.response?.data || err.message);
      alert("Failed to report. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">📢 Community Posts</h2>

      {/* Create new post */}
      <div className="flex mb-4">
        <input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Write a new post..."
          className="flex-1 p-2 border rounded-l"
        />
        <button
          onClick={handleCreatePost}
          className="bg-blue-600 text-white px-4 rounded-r"
        >
          Post
        </button>
      </div>

      {/* List of posts */}
      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <strong>{post.user?.name || 'User'}</strong>
              <div className="space-x-2 text-sm text-blue-600">
                <button onClick={() => handleLike(post.id)}>
                  ❤️ {post.likes?.length || 0}
                </button>
                <button onClick={() => handleReport(post.id)}>
                  🚩 Report
                </button>
              </div>
            </div>
            <p className="mt-2">{post.content}</p>

            {/* Comments */}
            <ul className="mt-3 space-y-1 pl-4 text-sm text-gray-700">
              {(post.comments || []).map((c) => (
                <li key={c.id}>
                  <em>{c.user?.name || 'User'}:</em> {c.comment}

                </li>
              ))}
            </ul>

            {/* Add Comment */}
            <div className="flex mt-2">
              <input
                type="text"
                className="flex-1 p-1 border rounded-l text-sm"
                placeholder="Write a comment..."
                value={commentInputs[post.id] || ''}
                onChange={(e) =>
                  setCommentInputs((prev) => ({
                    ...prev,
                    [post.id]: e.target.value,
                  }))
                }
              />
              <button
                className="bg-gray-200 px-3 rounded-r text-sm"
                onClick={() => handleComment(post.id)}
              >
                Comment
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Report Post</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of Abuse
              </label>
              <select
                value={reportData.abuse_type}
                onChange={(e) => setReportData(prev => ({ ...prev, abuse_type: e.target.value }))}
                className="w-full p-2 border rounded-lg"
              >
                {abuseTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Details
              </label>
              <textarea
                value={reportData.comment}
                onChange={(e) => setReportData(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                rows="4"
                placeholder="Please provide details about why you're reporting this post..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportData({ abuse_type: 'spam', comment: '' });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
