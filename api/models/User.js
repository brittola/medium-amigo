import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Post from './Post.js';
import PostLike from './PostLike.js';

const User = sequelize.define('user', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
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

// relacionamentos
User.hasMany(Post, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Post.belongsTo(User, {
    foreignKey: 'user_id'
});

User.belongsToMany(Post, { through: PostLike, foreignKey: 'user_id', otherKey: 'post_id', onDelete: 'CASCADE' });
Post.belongsToMany(User, { through: PostLike, foreignKey: 'post_id', otherKey: 'user_id', onDelete: 'CASCADE' });

export default User;
