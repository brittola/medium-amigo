import express from 'express';
import Authenticator from '../middlewares/Authenticator.js';
import PostsController from '../controllers/PostsController.js';

export default class PostRoutes {
    constructor() {
        this.router = express.Router();
        this.Authenticator = new Authenticator();
    }

    setup() {
        this.router.get('/', PostsController.get);
        this.router.post('/', this.Authenticator.verifyToken, PostsController.create);
        this.router.put('/:id', this.Authenticator.verifyToken, PostsController.update);
        this.router.delete('/:id', this.Authenticator.verifyToken, PostsController.remove);
        
        this.router.post('/like/:id', this.Authenticator.verifyToken, PostsController.like);
        this.router.delete('/like/:id', this.Authenticator.verifyToken, PostsController.unlike);

        return this.router;
    }
}
