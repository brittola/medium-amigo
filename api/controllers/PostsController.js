const Post = require('../models/Post');
const User = require('../models/User');
const { hasEmptyField } = require('../utils/Validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;
const PostLike = require('../models/PostLike');
const Sequelize = require('sequelize');
const sequelize = require('../database/database');

class PostsController {
    async create(req, res) {
        const { title, content, summary, available_at } = req.body;

        if (hasEmptyField(title, content, summary)) {
            res.status(400).send("Um ou mais campos faltando");
            return;
        }

        try {
            await Post.create({ title, content, summary, available_at, user_id: res.locals.loggedUserId });
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
            let loggedUserId = 0;
            if (req.header('Authorization')) {
                const token = req.header('Authorization').replace('Bearer ', '');

                jwt.verify(token, secret, (err, decodedToken) => {
                    if (!err) {
                        loggedUserId = decodedToken.id;
                    }
                });
            }

            const countLikesQuery = `CAST((SELECT COUNT(*) FROM posts_likes AS post_like WHERE post_like.post_id = post.id) AS INTEGER)`;
            const posts = await Post.findAll({
                where: {
                    is_deleted: false,
                    available_at: {
                        [Sequelize.Op.lt]: Sequelize.literal('CURRENT_TIMESTAMP')
                    }
                },
                attributes: {
                    include: [
                        [
                            Sequelize.literal(countLikesQuery),
                            'likes'
                        ]
                    ],
                    exclude: ['user_id', 'created_at', 'updated_at']
                },
                limit,
                offset,
                order: [['available_at', 'DESC']],
                include: {
                    model: User,
                    attributes: ['id', 'name']
                }
            });

            const modifiedPosts = posts.map(post => {
                return {
                    ...post.toJSON(),
                    allowEdit: loggedUserId === post.user.id,
                    allowRemove: loggedUserId === post.user.id,
                };
            });

            res.status(200).json(modifiedPosts);
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
            const post = await Post.findOne({ where: { id: postId, is_deleted: false } });

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

        const t = await sequelize.transaction();

        try {
            const post = await Post.findOne({ where: { id: postId, is_deleted: false }, transaction: t });

            if (!post) {
                res.status(404).send("Postagem não encontrada");
                return;
            }

            if (post.user_id != loggedUserId) {
                res.status(403).send("Não é possível excluir a postagem de outro usuário");
                return;
            }


            await post.update({ is_deleted: true }, { transaction: t });
            await post.destroy({ transaction: t });
            t.commit();
            
            res.status(202).send("Post excluído");
        } catch (err) {
            await t.rollback();
            console.log(err);
            res.status(500).send("Erro ao excluir a postagem");
        }
    }

    async like(req, res) {
        const postId = req.params.id;
        const { loggedUserId } = res.locals;

        const t = await sequelize.transaction();

        try {
            const like = await PostLike.findOne({ where: { post_id: postId, user_id: loggedUserId, is_deleted: false }, transaction: t });

            if (like) {
                res.status(400).send("Este post já foi curtido por este usuário");
                return;
            }

            const post = await Post.findOne({ where: {id: postId, is_deleted: false }, transaction: t });

            if (!post) {
                res.status(404).send("Essa publicação não existe");
                return;
            }

            await PostLike.create({ post_id: postId, user_id: loggedUserId }, { transaction: t });
            await t.commit();
            res.send("Like registrado");

        } catch (err) {
            await t.rollback();
            console.log(err);
            res.status(500).send("Não foi possível dar like no post");
        }
    }

    async unlike(req, res) {
        const postId = req.params.id;
        const { loggedUserId } = res.locals;

        const t = await sequelize.transaction();

        try {
            const post = await Post.findOne({ where: {id: postId, is_deleted: false }, transaction: t });

            if (!post) {
                res.status(404).send("Essa publicação não existe");
                return;
            }

            const like = await PostLike.findOne({ where: { post_id: postId, user_id: loggedUserId, is_deleted: false }, transaction: t });

            if (!like) {
                res.status(400).send("Este usuário não curtiu este post");
                return;
            }

            await like.update({ is_deleted: true }, { transaction: t });
            await like.destroy({ transaction: t });
            await t.commit();

            res.status(202).send("Like removido");

        } catch (err) {
            await t.rollback();
            console.log(err);
            res.status(500).send("Não foi remover like do post");
        }
    }
}

module.exports = new PostsController();