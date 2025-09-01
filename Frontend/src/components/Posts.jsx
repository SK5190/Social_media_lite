import React, { useEffect, useState } from 'react';
import { getAllPosts, deletePost } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Assuming useAuth provides user info, including _id

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getAllPosts();
      setPosts(response.data.posts);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  if (loading) {
    return <div className="text-center mt-8 text-xl font-semibold">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600 text-xl font-semibold">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-8 sm:mb-10">Recent Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {posts.length > 0 ? (posts.map((post) => (
          <div key={post._id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform hover:scale-105 transition duration-300 ease-in-out">
            {post.image && (
              <div className="flex-shrink-0">
                <img src={post.image} alt={post.caption} className="w-full h-56 sm:h-64 object-cover" />
              </div>
            )}
            <div className="p-4 sm:p-5 flex flex-col flex-grow">
              <p className="text-base sm:text-lg font-medium mb-3 flex-grow">{post.caption}</p>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-gray-500 mt-2">
                <span className="mb-2 sm:mb-0">Posted by: {post.user?.username || 'Unknown'}</span>
                {user && user._id === post.user._id && (
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-xs transition duration-300 ease-in-out"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))) : (
          <div className="text-center col-span-full text-gray-600 text-lg sm:text-xl mt-8">No posts found. Be the first to create one!</div>
        )}
      </div>
    </div>
  );
}

export default Posts;
