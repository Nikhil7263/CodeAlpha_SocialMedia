const express = require("express");

const router = express.Router();

const postController = require("../controllers/postController");

router.post("/", postController.createPost);

router.get("/", postController.getPosts);

router.put("/:id/like", postController.likePost);

router.post("/:id/comment", postController.addComment);

router.delete("/:id", postController.deletePost);

router.put("/:id", postController.editPost);

module.exports = router;