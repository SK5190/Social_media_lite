const express = require('express');
const { registerController, loginController, getMeController } = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware'); // Import authMiddleware
const router = express.Router();

router.post('/register', registerController);
router.post("/login", loginController);
router.get("/me", authMiddleware, getMeController);












module.exports = router;