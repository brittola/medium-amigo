const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const Post = require('./Post');
const PostLike = require('./PostLike');

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
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// relacionamentos
User.hasMany(Post, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Post.belongsTo(User, {
    foreignKey: 'user_id'
});

User.belongsToMany(Post, { through: PostLike, foreignKey: 'user_id', otherKey: 'post_id' });
Post.belongsToMany(User, { through: PostLike, foreignKey: 'post_id', otherKey: 'user_id' });

module.exports = User;