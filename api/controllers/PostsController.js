const Post = require('../models/Post');
const User = require('../models/User');
const { hasEmptyField } = require('../utils/Validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

class PostsController {
    async create(req, res) {
        const { title, content, summary } = req.body;

        if (hasEmptyField(title, content, summary)) {
            res.status(400).send("Um ou mais campos faltando");
            return;
        }

        try {
            await Post.create({ title, content, summary, user_id: res.locals.loggedUserId });
            res.status(201).send("Post publicado");
        } catch (err) {
            console.log(err);
            res.status(500).send("Erro ao publicar post");
        }
    }

    async get(req, res) {
        let { page } = req.query;
        page = Number(page);

        if (!Number.isInteger(page) || page <= 0) {
            res.status(400).json({ error: "O parâmetro 'page' deve ser um inteiro positivo." });
            return;
        }

        const limit = 10;
        const offset = limit * (page - 1);

        try {
            let posts = await Post.findAll({
                attributes: { exclude: ['user_id', 'created_at', 'updated_at'] },
                limit,
                offset,
                order: [['available_at', 'DESC']],
                include: {
                    model: User,
                    attributes: ['id', 'name']
                }
            });

            let loggedUserId = 0;
            if (req.header('Authorization')) {
                const token = req.header('Authorization').replace('Bearer ', '');

                jwt.verify(token, secret, (err, decodedToken) => {

                    if (!err) {
                        loggedUserId = decodedToken.id;
                    }

                });
            }

            posts = posts.map(post => {
                return {
                    ...post.toJSON(),
                    allowEdit: loggedUserId === post.user.id,
                    allowRemove: loggedUserId === post.user.id
                }
            });

            res.status(200).json(posts);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erro ao buscar posts." });
        }
    }

    async update(req, res) {
        const { title, content, summary } = req.body;
        const postId = req.params.id;
        const { loggedUserId } = res.locals;

        if (!postId) {
            res.status(400).send("É necessário indicar o id do post para atualizar");
            return;
        }

        try {
            const post = await Post.findOne({ where: { id: postId } });

            if (!post) {
                res.status(404).send("Postagem não encontrada");
                return;
            }

            if (post.user_id != loggedUserId) {
                res.status(403).send("Não é possível atualizar o post de outro usuário");
                return;
            }

            const updatedFields = {};

            if (title && title !== "") {
                updatedFields.title = title;
            }
            if (content && content !== "") {
                updatedFields.content = content;
            }
            if (summary && summary !== "") {
                updatedFields.summary = summary;
            }

            if (Object.keys(updatedFields).length > 0) {
                await post.update(updatedFields);
            }

            res.status(200).send("Post atualizado com sucesso");

        } catch (err) {
            console.log(err);
            res.status(500).send("Não foi possível atualizar o post");
        }
    }

    async remove(req, res) {
        const postId = req.params.id;
        const { loggedUserId } = res.locals;

        if (!postId) {
            res.status(400).send("É necessário indicar o id do post para excluir");
            return;
        }

        try {
            const post = await Post.findOne({ where: { id: postId } });

            if (!post) {
                res.status(404).send("Postagem não encontrada");
                return;
            }

            if (post.user_id != loggedUserId) {
                res.status(403).send("Não é possível excluir a postagem de outro usuário");
                return;
            }

            await post.destroy();
            res.status(202).send("Post excluído");
        } catch (err) {
            console.log(err);
            res.status(500).send("Erro ao excluir a postagem");
        }
    }
}

module.exports = new PostsController();