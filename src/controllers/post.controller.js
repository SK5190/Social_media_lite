const postModel = require('./../models/post.model')
const generateContent = require('../service/ai.service');
const uploadImage = require('../service/storage.service');
const {v4 : uuidv4} = require('uuid')


async function createPostController(req,res){
    const file = req.file;
    // console.log("File received:", file);

    const base64Image = new Buffer.from(file.buffer).toString('base64');

    const caption = await generateContent(base64Image);

    const result = await uploadImage(file.buffer, `${uuidv4()}`);
    // console.log(result);

    const post = await postModel.create({
        caption: caption,
        image: result.url,
        user: req.user._id,

    })

    res.status(201).json({
        message: "Post created successfully",
        post
    })
}

async function getAllPostsController(req, res) {
    try {
        const posts = await postModel.find().populate('user', 'username').sort({ createdAt: -1 });
        res.status(200).json({
            message: "Posts fetched successfully",
            posts
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({
            message: "Failed to fetch posts",
            error: error.message
        });
    }
}

async function deletePostController(req, res) {
    try {
        const { id } = req.params;
        const post = await postModel.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Ensure the user deleting the post is the owner
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this post." });
        }

        await postModel.findByIdAndDelete(id);

        res.status(200).json({
            message: "Post deleted successfully."
        });

    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({
            message: "Failed to delete post",
            error: error.message
        });
    }
}

module.exports = {
    createPostController,
    getAllPostsController,
    deletePostController
}