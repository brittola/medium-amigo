const express = require('express');
const router = express.Router();
const Authenticator = require('../middlewares/Authenticator');
const PostsController = require('../controllers/PostsController');

router.post('/posts', Authenticator.verifyToken, PostsController.create);
router.get('/posts', PostsController.get);

module.exports = router;