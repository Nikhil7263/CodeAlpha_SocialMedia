const Post = require("../models/Post");

// CREATE POST
exports.createPost = async (req, res) => {
    try {
        const { userId, content } = req.body;

        const post = new Post({
            userId: req.body.userId,  // ✅ IMPORTANT
            content: req.body.content,
            likes: 0,
            comments: []
        });

        await post.save();

        res.json(post);

    } catch (error) {
        res.status(500).json({ message: "Error creating post" });
    }
};

// GET POSTS
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts" });
    }
};

// LIKE POST
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });

        post.likes += 1;
        await post.save();

        res.json(post);

    } catch (error) {
        res.status(500).json({ message: "Error liking post" });
    }
};

// ADD COMMENT
exports.addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!req.body.text || req.body.text.trim() === "") {
            return res.status(400).json({ message: "Empty comment not allowed" });
        }

        post.comments.push({ text: req.body.text });

        await post.save();

        res.json(post);

    } catch (error) {
        res.status(500).json({ message: "Error adding comment" });
    }
};

exports.deletePost = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({
            message: "Post deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }
};

exports.editPost = async (req, res) => {
    try {

        const { content } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        post.content = content;

        await post.save();

        res.json({
            message: "Post updated successfully",
            post
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }
};