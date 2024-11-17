import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaThumbsUp, FaTrashAlt, FaEdit, FaComment } from 'react-icons/fa';
import './PostsList.css'; // Import the CSS file

const PostsList = () => {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState({});

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/posts');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/posts/${id}`);
            setPosts(posts.filter((post) => post._id !== id));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleAddComment = async (postId) => {
        const userId = "user123";
        const commentText = comments[postId];
        try {
            const response = await axios.put(
                `http://localhost:5000/api/posts/${postId}/comment`,
                { userId, text: commentText }
            );
            setPosts(
                posts.map((post) =>
                    post._id === postId
                        ? { ...post, comments: response.data.comments }
                        : post
                )
            );
            setComments((prev) => ({ ...prev, [postId]: '' }));
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            const response = await axios.delete(
                `http://localhost:5000/api/posts/${postId}/comment/${commentId}`
            );
            setPosts(
                posts.map((post) =>
                    post._id === postId
                        ? { ...post, comments: response.data.comments }
                        : post
                )
            );
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleLike = async (id, userId) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/posts/${id}/like`,
                { userId }
            );
            setPosts(
                posts.map((post) =>
                    post._id === id
                        ? {
                            ...post,
                            likes: response.data.likes,
                            likedBy: response.data.likedBy,
                        }
                        : post
                )
            );
        } catch (error) {
            console.error('Error toggling like:', error);
            alert(error.response?.data?.message || 'Failed to toggle like');
        }
    };

    const handleCommentChange = (postId, e) => {
        const newComment = e.target.value;
        setComments((prev) => ({ ...prev, [postId]: newComment }));
    };

    return (
        <div className="posts-container">
            {/* <h2>All Posts</h2> */}
            <ul>
                {posts.map((post) => {
                    const userId = "user123";
                    const isLiked = post.likedBy.includes(userId);

                    return (
                        <li key={post._id} className="post-item">
                            <img
                                src={`http://localhost:5000${post.imageUrl}`}
                                alt={post.title}
                                className="post-image"
                            />
                            <h3 className="post-title">{post.title}</h3>
                            <p className="post-description">{post.description}</p>

                            <div className="buttons-container">
                                <button
                                    className="button"
                                    onClick={() => handleLike(post._id, userId)}
                                    title={isLiked ? 'Unlike' : 'Like'}
                                >
                                    <FaThumbsUp color={isLiked ? '#007bff' : '#6c757d'} size={18} />
                                </button>
                                <Link to={`/edit/${post._id}`} className="button" title="Edit">
                                    <FaEdit color="#ffc107" size={18} />
                                </Link>
                                <button
                                    className="button delete"
                                    onClick={() => handleDelete(post._id)}
                                    title="Delete"
                                >
                                    <FaTrashAlt color="#dc3545" size={18} />
                                </button>
                            </div>

                            <div className="comment-section">
                                <h4>Comments</h4>
                                {post.comments.map((comment) => (
                                    <div key={comment._id} className="comment-item">
                                        <p>{comment.text}</p>
                                        <button
                                            className="button delete"
                                            onClick={() =>
                                                handleDeleteComment(post._id, comment._id)
                                            }
                                            title="Delete Comment"
                                        >
                                            <FaTrashAlt color="#dc3545" size={14} />
                                        </button>
                                    </div>
                                ))}

                                <textarea
                                    value={comments[post._id] || ''}
                                    onChange={(e) => handleCommentChange(post._id, e)}
                                    placeholder="Add a comment..."
                                />
                                <button
                                    className="add-comment-btn"
                                    onClick={() => handleAddComment(post._id)}
                                    title="Add Comment"
                                >
                                    <FaComment size={18} />
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default PostsList;
