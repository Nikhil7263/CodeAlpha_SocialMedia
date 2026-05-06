const express = require("express");
const router = express.Router();

const followController = require("../controllers/followController");

router.post("/follow", followController.followUser);
router.post("/unfollow", followController.unfollowUser);

module.exports = router;