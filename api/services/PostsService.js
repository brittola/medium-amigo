import Post from "../models/Post.js";
import User from "../models/User.js";
import { Sequelize } from "sequelize";
import { subHours } from 'date-fns';
import sequelize from "../database/database.js";

class PostService {
    async create(data) {
        try {
            await Post.create(data);
            return true;
        } catch (err) {
            throw err;
        }
    }

    async get(page, loggedUserId) {
        const limit = 10;
        const offset = limit * (page - 1);

        try {
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

            const modifiedPosts = posts.map(post => {
                const postJSON = post.toJSON();
                postJSON.available_at = subHours(new Date(postJSON.available_at), 3);
                return {
                    ...postJSON,
                    allowEdit: loggedUserId === post.user.id,
                    allowRemove: loggedUserId === post.user.id,
                };
            });

            return modifiedPosts;
        } catch (err) {
            throw err;
        }
    }

    async getById(postId) {
        try {
            const post = await Post.findOne({ where: { id: postId, is_deleted: false } });
            return post;
        } catch (err) {
            throw err;
        }
    }

    async update(data, postId) {
        try {
            await Post.update(data, { where: { id: postId } });
            return true;
        } catch (err) {
            throw err;
        }
    }

    async remove(postId) {

        const t = await sequelize.transaction();

        try {
            await Post.update({ is_deleted: true }, { where: { id: postId }, transaction: t });
            await Post.destroy({ where: { id: postId }, transaction: t });

            await t.commit();

            return true;
        } catch (err) {
            await t.rollback();
            throw err;
        }
    }

    async incrementLikes(postId) {
        try {
            await Post.increment('likes', { where: { id: postId } });
            return true;
        } catch (err) {
            throw err;
        }
    }

    async decrementLikes(postId) {
        try {
            await Post.decrement('likes', { where: { id: postId } });
            return true;
        } catch (err) {
            throw err;
        }
    }
}

export default new PostService();