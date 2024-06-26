import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const PostLike = sequelize.define('posts_likes', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'posts',
            key: 'id'
        }
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

export default PostLike;
