import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';  // Import the CSS file

const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (imageFile) {
            formData.append('image', imageFile);
        } else if (imageUrl) {
            formData.append('imageUrl', imageUrl);
        }

        try {
            const response = await axios.post('http://localhost:5000/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Post created:', response.data);
            // Reset form
            navigate(`/`);
            setTitle('');
            setDescription('');
            setImageUrl('');
            setImageFile(null);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="create-post-container">
            <h2>Create Post</h2>
            <form className="create-post-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                {/* <div className="form-group">
                    <label>Image URL (optional)</label>
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </div> */}
                <div className="form-group">
                    <label>Image Upload (optional)</label>
                    <input
                        type="file"
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />
                </div>
                <button type="submit" className="submit-button">Create Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
