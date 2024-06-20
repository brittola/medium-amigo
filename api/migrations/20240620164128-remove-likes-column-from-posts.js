'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('posts', 'likes');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('posts', 'likes', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  }
};
