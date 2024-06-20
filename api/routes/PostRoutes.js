const express = require('express');
const router = express.Router();
const Authenticator = require('../middlewares/Authenticator');
const PostsController = require('../controllers/PostsController');

router.get('/posts', PostsController.get);
router.post('/posts', Authenticator.verifyToken, PostsController.create);
router.delete('/posts/:id', Authenticator.verifyToken, PostsController.remove);

module.exports = router;