import express from 'express';
import UsersController from '../controllers/UsersController.js';

export default class UserRoutes {
    constructor() {
        this.router = express.Router();

        this.UsersController = new UsersController();
    }

    setup() {
        this.router.post('/', this.UsersController.create);
        this.router.post('/auth', this.UsersController.auth);

        return this.router;
    }
}
