const Post = require('../models/Post');

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;

        // If imageUrl is provided directly in the body
        if (imageUrl) {
            const newPost = new Post({ title, description, imageUrl });
            await newPost.save();

            return res.status(201).json(newPost);
        }

        // If image file is uploaded via Multer
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const uploadedImageUrl = `/uploads/${req.file.filename}`;
        const newPost = new Post({ title, description, imageUrl: uploadedImageUrl });
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
};

// // Like a post
// exports.likePost = async (req, res) => {
//     const postId = req.params.id;

//     try {
//         const post = await Post.findById(postId);
//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }

//         // Increment the like count
//         post.likes += 1;
//         await post.save();

//         res.status(200).json(post);
//     } catch (error) {
//         console.error('Error liking post:', error);
//         res.status(500).json({ message: 'Error liking post', error: error.message });
//     }
// };


exports.likePost = async (req, res) => {
    const { id } = req.params;
    const userId = req.body.userId; // Assume we receive userId in the request body

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user has already liked this post
        const hasLiked = post.likedBy.includes(userId);

        if (hasLiked) {
            // If the user has already liked, remove the like (unlike)
            post.likes -= 1;
            post.likedBy = post.likedBy.filter((user) => user !== userId);
        } else {
            // If the user has not liked, add the like
            post.likes += 1;
            post.likedBy.push(userId);
        }

        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error toggling like', error });
    }
};
// Add comment to a post
exports.addComment = async (req, res) => {
    const { id } = req.params; // Post ID
    const { userId, text } = req.body; // User ID and comment text

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Add new comment to post
        post.comments.push({ userId, text });
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
};

// Delete comment from a post
exports.deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Remove the comment by its ID
        post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error });
    }
};



// Get all posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    try {
        const { title, description } = req.body;
        const postId = req.params.id;
        let updatedPost = {};

        // Check if there's an image file and update accordingly
        if (req.file) {
            updatedPost.imageUrl = `/uploads/${req.file.filename}`;
        }

        // Include the title and description in the update
        if (title) updatedPost.title = title;
        if (description) updatedPost.description = description;

        const post = await Post.findByIdAndUpdate(postId, updatedPost, {
            new: true, // Return the updated document
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);  // Return the updated post
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Error updating post', error: error.message });
    }
};


// Get a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Error fetching post', error: error.message });
    }
};


// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        await Post.findByIdAndDelete(id);
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
};
