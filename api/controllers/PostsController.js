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
                attributes: {exclude:['user_id', 'created_at', 'updated_at']},
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
}

module.exports = new PostsController();