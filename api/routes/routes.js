import { Router } from "express";
import PostRoutes from "./PostRoutes.js";
import UserRoutes from "./UserRoutes.js";

export default class Routes {
    constructor() {
        this.routes = new Router();

        this.PostRoutes = new PostRoutes();
        this.UserRoutes = new UserRoutes();
    }

    setup() {
        this.routes.use('/posts', this.PostRoutes.setup());
        this.routes.use('/users', this.UserRoutes.setup());

        return this.routes;
    }
}