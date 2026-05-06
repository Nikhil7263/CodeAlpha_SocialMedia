const User = require("../models/User");

exports.followUser = async (req, res) => {
    try {
        const { userId, targetId } = req.body;

        if (!userId || !targetId) {
            return res.status(400).json({ message: "Missing IDs" });
        }

        if (userId === targetId) {
            return res.status(400).json({ message: "Cannot follow yourself" });
        }

        const user = await User.findById(userId);
        const target = await User.findById(targetId);

        if (!user || !target) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.following.includes(targetId)) {
            return res.status(400).json({ message: "Already following" });
        }

        user.following.push(targetId);
        target.followers.push(userId);

        await user.save();
        await target.save();

        res.json({ message: "Followed successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const { userId, targetId } = req.body;

        const user = await User.findById(userId);
        const target = await User.findById(targetId);

        if (!user || !target) {
            return res.status(404).json({ message: "User not found" });
        }

        user.following = user.following.filter(
            id => id.toString() !== targetId
        );

        target.followers = target.followers.filter(
            id => id.toString() !== userId
        );

        await user.save();
        await target.save();

        res.json({ message: "Unfollowed successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};