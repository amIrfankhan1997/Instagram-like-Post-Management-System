const mongoose = require('mongoose');

// const postSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     imageUrl: { type: String, required: true },
// }, { timestamps: true });

// module.exports = mongoose.model('Post', postSchema);

// const postSchema = new mongoose.Schema(
//     {
//         title: {
//             type: String,
//             required: true,
//         },
//         description: {
//             type: String,
//             required: true,
//         },
//         imageUrl: {
//             type: String,
//             required: true,
//         },
//         likes: {
//             type: Number,
//             default: 0,
//         },
//     },
//     { timestamps: true }
// );


// const postSchema = new mongoose.Schema(
//     {
//         title: { type: String, required: true },
//         description: { type: String, required: true },
//         imageUrl: { type: String },
//         likes: { type: Number, default: 0 },
//         likedBy: { type: [String], default: [] }, // Store user IDs who liked the post
//     },
//     { timestamps: true }
// );

// const Post = mongoose.model('Post', postSchema);
// module.exports = Post;


// module.exports = mongoose.model('Post', postSchema);


const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String },
        likes: { type: Number, default: 0 },
        likedBy: { type: [String], default: [] }, // Array to hold user IDs who liked
        comments: [
            {
                userId: { type: String, required: true },
                text: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

