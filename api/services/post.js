import Post from "../models/Post.js";
import User from "../models/User.js";
import { Sequelize } from "sequelize";
import { addHours, parseISO } from 'date-fns';
import PostLike from "../models/PostLike.js";

class PostService {
    async create(data) {

        if (data.available_at) {
            data.available_at = addHours(parseISO(available_at), 3);
        }

        return await Post.create(data);
    }

    async get(page, loggedUserId) {
        const limit = 10;
        const offset = limit * (page - 1);
        const posts = await Post.findAll({
            where: {
                is_deleted: false,
                available_at: {
                    [Sequelize.Op.lt]: Sequelize.literal('CURRENT_TIMESTAMP')
                }
            },
            attributes: {
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

        const modifiedPosts = await Promise.all(posts.map(async (post) => {
            const postJSON = post.toJSON();
            // postJSON.available_at = subHours(new Date(postJSON.available_at), 3);
            
            const like = await PostLike.findOne({
                where: {
                    post_id: post.id,
                    user_id: loggedUserId
                }
            });
        
            return {
                ...postJSON,
                allowEdit: loggedUserId === post.user.id,
                allowRemove: loggedUserId === post.user.id,
                is_liked: !!like
            };
        }));

        return modifiedPosts;
    }

    async getById(id, loggedUserId) {
        const post = await Post.findOne({
            where: {
                id,
                is_deleted: false,
                available_at: {
                    [Sequelize.Op.lt]: Sequelize.literal('CURRENT_TIMESTAMP')
                }
            },
            attributes: {
                exclude: ['user_id', 'created_at', 'updated_at']
            },
            include: {
                model: User,
                attributes: ['id', 'name']
            }
        });

        if (!post) {
            throw new Error("POST NOT FOUND");
        }

        const postJSON = post.toJSON();
        // postJSON.available_at = subHours(new Date(postJSON.available_at), 3);

        const like = await PostLike.findOne({where: {post_id: post.id, user_id: loggedUserId, is_deleted: false}});

        return {
            ...postJSON,
            allowEdit: loggedUserId === post.user.id,
            allowRemove: loggedUserId === post.user.id,
            is_liked: !!like
        };
    }

    async remove(id, loggedUserId, transaction) {
        const post = await Post.findOne({ where: { id, user_id: loggedUserId, is_deleted: false }, transaction });
        if (!post) {
            throw new Error("POST NOT FOUND");
        }

        await post.update({ is_deleted: true }, { transaction });
        return await post.destroy({ transaction });
    }
}

export default new PostService();