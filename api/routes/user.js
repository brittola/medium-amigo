import express from 'express';
import UsersController from '../controllers/user.js';
import UserSchemas from '../schemas/user.js';
import ValidatorMiddleware from '../middlewares/validator.js';

export default class UserRoutes {
    constructor() {
        this.router = express.Router();

        this.UsersController = new UsersController();
    }

    setup() {
        this.router.post('/', ValidatorMiddleware.validate(UserSchemas.create), this.UsersController.create);
        this.router.post('/auth', ValidatorMiddleware.validate(UserSchemas.auth), this.UsersController.auth);

        return this.router;
    }
}
