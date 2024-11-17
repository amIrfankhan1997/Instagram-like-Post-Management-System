import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditPost.css'; // Import the CSS file for styling

const EditPost = () => {
    const { id } = useParams(); // Get post ID from URL
    const navigate = useNavigate(); // Used for navigation after form submission

    const [post, setPost] = useState({
        title: '',
        description: '',
        imageUrl: ''
    });

    const [imagePreview, setImagePreview] = useState(''); // New state to manage image preview

    // Fetch the existing post data when the component is loaded
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
                setPost(response.data); // Populate form with the current post data

                // Set image preview from the existing post's imageUrl if available
                if (response.data.imageUrl) {
                    setImagePreview(`http://localhost:5000${response.data.imageUrl}`);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: value, // Update only the specific field
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the selected image file
        if (file) {
            setPost((prevPost) => ({
                ...prevPost,
                imageUrl: file, // Set the file object to imageUrl
            }));

            // Create an object URL for the selected image to display it as a preview
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the fields before sending the request
        if (!post.title || !post.description) {
            alert('Both title and description are required!');
            return;
        }

        const formData = new FormData();
        formData.append('title', post.title);
        formData.append('description', post.description);

        // Append the image file only if a new file is selected
        if (post.imageUrl instanceof File) {
            formData.append('image', post.imageUrl);
        }

        try {
            // Send PUT request to update the post
            const response = await axios.put(
                `http://localhost:5000/api/posts/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Handle success - redirect to post details page or show a success message
            console.log('Post updated:', response.data);
            navigate(`/`); // Redirect to the updated post view
        } catch (error) {
            console.error('Error updating post:', error);
            alert('There was an error updating the post!');
        }
    };

    // Handle Cancel button click
    const handleCancel = () => {
        navigate(`/`); // Redirect to the posts list or a previous page
    };

    return (
        <div className="edit-post-container">
            <h2>Edit Post</h2>
            <form onSubmit={handleSubmit} className="edit-post-form">
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={post.description}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Image:</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="form-control-file"
                    />
                    {imagePreview && (
                        <div className="image-preview">
                            <h4>Current Image:</h4>
                            <img
                                src={imagePreview}
                                alt="Current Post"
                                className="image-preview-img"
                            />
                        </div>
                    )}
                </div>
                <div className="form-buttons">
                    <button type="submit" className="submit-btn">Update Post</button>
                    <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditPost;
