const express = require("express");
const router = express.Router();
const { createPost, getAllPosts, getPostById, getAllCounsellorPosts } = require("../controllers/post");

// Route to create a post
router.post("/posts", createPost);

// Route to fetch all posts
router.get("/posts", getAllPosts);

// Route to fetch all posts of a counsellor
router.get("/posts/counsellor/:counsellorId", getAllCounsellorPosts);

// Route to retrieve a specific post by postId
router.get("/posts/:postId", getPostById);

module.exports = router;
