import 'dotenv/config';
import sequelize from '../database/database.js';
import PostService from '../services/post.js';
import AuthUtils from '../utils/auth.js';
import LikeService from '../services/like.js';
import BaseController from './base.js';
import Post from '../models/Post.js';

export default class PostController extends BaseController {

    constructor() {
        super();

        this.create = this.create.bind(this);
        this.get = this.get.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.like = this.like.bind(this);
        this.unlike = this.unlike.bind(this);
    }

    async create(req, res) {
        const { title, content, summary, available_at } = req.data;
        const { loggedUserId } = res.locals;

        try {
            const result = await PostService.create({ title, content, summary, available_at, user_id: loggedUserId });
            this.handleResponse(result, res);
        } catch (err) {
            console.log(err, "CREATE ERROR");
            this.handleError(err, res);
        }
    }

    async get(req, res) {
        let { page } = req.filter;
        let loggedUserId = AuthUtils.getLoggedUser(req);

        try {
            const posts = await PostService.get(page, loggedUserId);

            this.handleResponse(posts, res);
        } catch (err) {
            console.log(err, "GET ERROR");
            this.handleError(err, res);
        }
    }

    async update(req, res) {
        const { loggedUserId } = res.locals;

        try {
            const result = await Post.update(req.data, { where: { id: req.filter.id, user_id: loggedUserId } })

            this.handleResponse(result[0], res);

        } catch (err) {
            console.log(err, "UPDATE ERROR");

            this.handleError(err, res);
        }
    }

    async remove(req, res) {
        const { loggedUserId } = res.locals;

        const t = await sequelize.transaction();

        try {
            const result = await PostService.remove(req.filter.id, loggedUserId, t);

            await t.commit();

            this.handleResponse(result, res);
        } catch (err) {
            console.log(err, "REMOVE ERROR");

            this.handleError(err, res);
        }
    }

    async like(req, res) {
        const { loggedUserId } = res.locals;

        const t = await sequelize.transaction();

        try {
            const result = await LikeService.create(req.filter.id, loggedUserId, t);

            await t.commit();

            this.handleResponse(result, res);
        } catch (err) {
            console.log(err, "LIKE ERROR");
            await t.rollback();

            this.handleError(err, res);
        }
    }

    async unlike(req, res) {
        const { loggedUserId } = res.locals;

        const t = await sequelize.transaction();

        try {
            const result = await LikeService.remove(req.filter.id, loggedUserId, t);

            await t.commit();

            this.handleResponse(result, res);

        } catch (err) {
            console.log(err, "UNLIKE ERROR");
            this.handleError(err, res);
        }
    }
}
