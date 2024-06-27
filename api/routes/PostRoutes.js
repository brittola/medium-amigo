import express from 'express';
import Authenticator from '../middlewares/Authenticator.js';
import PostsController from '../controllers/PostsController.js';

export default class PostRoutes {
    constructor() {
        this.router = express.Router();

        this.PostsController = new PostsController();
    }

    setup() {
        this.router.get('/', this.PostsController.get);
        this.router.post('/', Authenticator.verifyToken, this.PostsController.create);
        this.router.put('/:id', Authenticator.verifyToken, this.PostsController.update);
        this.router.delete('/:id', Authenticator.verifyToken, this.PostsController.remove);
        
        this.router.post('/like/:id', Authenticator.verifyToken, this.PostsController.like);
        this.router.delete('/like/:id', Authenticator.verifyToken, this.PostsController.unlike);

        return this.router;
    }
}
