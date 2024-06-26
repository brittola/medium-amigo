import express from 'express';
import UsersController from '../controllers/UsersController.js';

export default class UserRoutes {
    constructor() {
        this.router = express.Router();
    }

    setup() {
        this.router.post('/', UsersController.create);
        this.router.post('/auth', UsersController.auth);

        return this.router;
    }
}
