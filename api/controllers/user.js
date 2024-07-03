import bcrypt from 'bcryptjs';
import 'dotenv/config';
import UserService from '../services/user.js';
import BaseController from './base.js';

export default class UsersController extends BaseController {
    constructor() {
        super();

        this.create = this.create.bind(this);
        this.auth = this.auth.bind(this);
    }

    async create(req, res) {
        try {
            const hash = bcrypt.hashSync(req.data.password, 10);
            req.data.password = hash;
            const response = await UserService.create(req.data);

            this.handleResponse(response, res);
        } catch (err) {
            this.handleError(err, res);
        }
    }

    async auth(req, res) {
        try {
            const response = await UserService.login(req.data);
    
            this.handleResponse(response, res);
        } catch (error) {
            this.handleError(error, res);
        }
    }
}
