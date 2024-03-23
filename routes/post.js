const express = require("express");
const router = express.Router();
const { createPost, getAllPosts, getPostById } = require("../controllers/post");

// Route to create a post
router.post("/posts", createPost);

// Route to fetch all posts
router.get("/posts", getAllPosts);

// Route to retrieve a specific post by postId
router.get("/posts/:postId", getPostById);

module.exports = router;
