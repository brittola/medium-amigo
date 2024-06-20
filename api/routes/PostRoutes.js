const express = require('express');
const router = express.Router();
const Authenticator = require('../middlewares/Authenticator');
const PostsController = require('../controllers/PostsController');

router.get('/posts', PostsController.get);
router.post('/posts', Authenticator.verifyToken, PostsController.create);
router.put('/posts/:id', Authenticator.verifyToken, PostsController.update);
router.delete('/posts/:id', Authenticator.verifyToken, PostsController.remove);

router.post('/like/:id', Authenticator.verifyToken, PostsController.like);

module.exports = router;