import 'dotenv/config';
import sequelize from '../database/database.js';
import { addHours, parseISO } from 'date-fns';
import PostSchemas from '../schemas/Post.js';
import PostsService from '../services/PostsService.js';
import AuthUtils from '../utils/AuthUtils.js';
import Validator from '../utils/Validator.js';
import LikesService from '../services/LikesService.js';

export default class PostsController {

    async create(req, res) {
        const { title, content, summary, available_at } = req.body;
        const { loggedUserId } = res.locals;

        let adjustedAvailableAt;
        if (available_at) {
            adjustedAvailableAt = addHours(parseISO(available_at), 3);
        }

        try {
            await PostSchemas.create.validate({ title, content, summary, available_at });
            await PostsService.create({ title, content, summary, available_at: adjustedAvailableAt, user_id: loggedUserId });
            res.status(201).json({ message: "Post publicado" });
        } catch (err) {
            console.log(err);

            if (err.name === 'ValidationError') {
                res.status(400).json({ errors: err.errors });
                return;
            }

            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async get(req, res) {
        let { page } = req.query;
        let loggedUserId = AuthUtils.getLoggedUser(req);

        try {
            await PostSchemas.page.validate({ page });
            const posts = await PostsService.get(page, loggedUserId);

            res.json(posts);
        } catch (err) {
            console.log(err);

            if (err.name === 'ValidationError') {
                res.status(400).json({ errors: err.errors });
                return;
            }

            res.status(500).json({ error: 'Erro ao obter posts' });
        }
    }

    async update(req, res) {
        const { title, content, summary } = req.body;
        const postId = req.params.id;
        const { loggedUserId } = res.locals;


        try {
            await PostSchemas.update.validate({ title, content, summary, postId });

            const post = await PostsService.getById(postId);

            if (!post) {
                res.status(404).json({ error: "Postagem não encontrada" });
                return;
            }

            if (post.user_id != loggedUserId) {
                res.status(403).json({ error: "Não é possível atualizar o post de outro usuário" });
                return;
            }

            const validFields = Validator.removeEmptyFields({ title, content, summary });

            await PostsService.update(validFields, postId);

            res.status(200).json({ message: "Post atualizado com sucesso" });

        } catch (err) {
            console.log(err);

            if (err.name === 'ValidationError') {
                res.status(400).json({ errors: err.errors });
                return;
            }

            res.status(500).json({ error: "Não foi possível atualizar o post" });
        }
    }

    async remove(req, res) {
        const postId = req.params.id;
        const { loggedUserId } = res.locals;

        try {
            await PostSchemas.postId.validate({ postId });
            const post = await PostsService.getById(postId);

            if (!post) {
                res.status(404).json({ error: "Postagem não encontrada" });
                return;
            }

            if (post.user_id != loggedUserId) {
                res.status(403).json({ error: "Não é possível excluir a postagem de outro usuário" });
                return;
            }

            await PostsService.remove(postId);

            res.status(202).json({ message: "Post excluído" });
        } catch (err) {
            console.log(err);

            if (err.name === 'ValidationError') {
                res.status(400).json({ errors: err.errors });
                return;
            }

            res.status(500).json({ error: "Erro ao excluir a postagem" });
        }
    }

    async like(req, res) {
        const postId = req.params.id;
        const { loggedUserId } = res.locals;


        try {
            await PostSchemas.postId.validate({ postId });

            const like = await LikesService.getOne(postId, loggedUserId);

            if (like) {
                res.status(400).json({ error: "Este post já foi curtido por este usuário" });
                return;
            }

            const post = await PostsService.getById(postId);

            if (!post) {
                res.status(404).json({ error: "Essa publicação não existe" });
                return;
            }

            await LikesService.create(postId, loggedUserId);
            await PostsService.incrementLikes(postId);

            res.status(201).json({ message: "Like registrado" });

        } catch (err) {
            console.log(err);

            if (err.name === 'ValidationError') {
                res.status(400).json({ errors: err.errors });
                return;
            }

            res.status(500).json({ error: "Não foi possível dar like no post" });
        }
    }

    async unlike(req, res) {
        const postId = req.params.id;
        const { loggedUserId } = res.locals;


        const t = await sequelize.transaction();

        try {
            await PostSchemas.postId.validate({ postId });
            const post = await PostsService.getById(postId);

            if (!post) {
                res.status(404).json({ error: "Essa publicação não existe" });
                return;
            }

            const like = await LikesService.getOne(postId, loggedUserId);

            if (!like) {
                res.status(400).json({ error: "Este usuário não curtiu este post" });
                return;
            }

            await LikesService.remove(like);
            await PostsService.decrementLikes(postId);

            res.status(202).json({ message: "Like removido" });

        } catch (err) {
            console.log(err);

            if (err.name === 'ValidationError') {
                res.status(400).json({ errors: err.errors });
                return;
            }

            res.status(500).json({ error: "Não foi possível remover like do post" });
        }
    }
}
