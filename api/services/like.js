import PostLike from "../models/PostLike.js";
import Post from "../models/Post.js";

class LikesService {

    async create(postId, userId, transaction) {
        const post = await Post.findOne({ where: { id: postId, user_id: userId, is_deleted: false }, transaction });
        if (!post) {
            throw new Error("POST NOT FOUND");
        }

        const like = await PostLike.findOne({ where: { post_id: postId, user_id: userId, is_deleted: false }, transaction });
        if (like) {
            throw new Error("USER ALREADY LIKED THIS POST");
        }

        await post.increment('likes', { transaction });
        return await PostLike.create({ post_id: postId, user_id: userId }, { transaction });
    }

    async remove(postId, userId, transaction) {
        const post = await Post.findOne({ where: { id: postId, user_id: userId, is_deleted: false }, transaction });
        if (!post) {
            throw new Error("POST NOT FOUND");
        }

        const like = await PostLike.findOne({ where: { post_id: postId, user_id: userId }, transaction });
        if (!like) {
            throw new Error("LIKE NOT FOUND");
        }
        
        await post.decrement('likes', { transaction });
        await like.update({ is_deleted: true }, { transaction });
        return await like.destroy({ transaction });
    }
}

export default new LikesService();