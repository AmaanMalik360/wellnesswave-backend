const Post = require("../models/post");

const createPost = async (req, res) => {
    try {
        const { heading, body, userId } = req.body;
        // Check if heading and body are provided
        if (!heading || !body) {
            return res.status(400).json({ error: "Heading and body are required fields" });
        }

        // Create the post
        const post = new Post({
            heading,
            body,
            creator: userId, // Assign the creator to the current user's ID
        });

        // Save the post to the database
        await post.save();

        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Failed to create post" });
    }
};


// Controller function to fetch all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        res.status(200).send({posts});
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};

// Controller function to retrieve a specific post by postId
const getPostById = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ error: "Failed to fetch post" });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
};
