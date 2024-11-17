const express = require('express');
const upload = require('../middleware/upload');
const {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    addComment,
    deleteComment
} = require('../controllers/postController');

const router = express.Router();

router.post('/', upload.single('image'), createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', upload.single('image'), updatePost);
router.delete('/:id', deletePost);
router.put('/:id/like', likePost);
router.put('/:id/comment', addComment);
router.delete('/:postId/comment/:commentId', deleteComment);

module.exports = router;
