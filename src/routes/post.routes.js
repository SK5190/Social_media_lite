const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router();
const multer = require('multer');
const {createPostController, getAllPostsController, deletePostController} = require('../controllers/post.controller')

const upload = multer({ storage: multer.memoryStorage()})

// POST /api/post [protected]
router.post('/', authMiddleware,upload.single("image"), createPostController)
// GET /api/post [protected]
router.get('/', authMiddleware, getAllPostsController)
// DELETE /api/post/:id [protected]
router.delete('/:id', authMiddleware, deletePostController)







module.exports = router;