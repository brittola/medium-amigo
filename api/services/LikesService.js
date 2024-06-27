import sequelize from "../database/database.js";
import PostLike from "../models/PostLike.js";

class LikesService {
    async getOne(postId, userId) {
        try {
            const like = await PostLike.findOne({ where: { post_id: postId, user_id: userId, is_deleted: false } });
            return like;
        } catch (err) {
            throw err;
        }
    }

    async create(postId, userId) {
        try {
            PostLike.create({ post_id: postId, user_id: userId });
            return true;
        } catch (err) {
            throw err;
        }
    }

    async remove(like) {
        const t = await sequelize.transaction();

        try {
            await like.update({ is_deleted: true }, { transaction: t });
            await like.destroy({ transaction: t });
            await t.commit();
            
            return true;
        } catch(err) {
            await t.rollback();
            throw err;
        }
    }
}

export default new LikesService();