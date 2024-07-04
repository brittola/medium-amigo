import express from 'express';
import Authenticator from '../middlewares/authenticator.js';
import PostsController from '../controllers/post.js';
import Validator from '../middlewares/validator.js';
import PostSchemas from '../schemas/post.js';

export default class PostRoutes {
    constructor() {
        this.router = express.Router();

        this.PostsController = new PostsController();
    }

    setup() {
        this.router.get('/', Validator.validate(PostSchemas.get), this.PostsController.get);
        this.router.get('/:id', Validator.validate(PostSchemas.getById), this.PostsController.getById);
        this.router.post('/', Authenticator.verifyToken, Validator.validate(PostSchemas.create), this.PostsController.create);
        this.router.put('/:id', Authenticator.verifyToken, Validator.validate(PostSchemas.update), this.PostsController.update);
        this.router.delete('/:id', Authenticator.verifyToken, Validator.validate(PostSchemas.delete), this.PostsController.remove);
        
        this.router.post('/like/:id', Authenticator.verifyToken, Validator.validate(PostSchemas.like), this.PostsController.like);
        this.router.delete('/like/:id', Authenticator.verifyToken, Validator.validate(PostSchemas.like), this.PostsController.unlike);

        return this.router;
    }
}
