/**
 * Created by lewis.knoxstreader on 8/12/16.
 */

module.exports = function (sequelize, Sequelize) {

    return sequelize.define('Key', {
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'pl_users',
          key: 'id'
        }
      }
    }, {
      tableName: 'keys',
      timestamps: false,
  });

};
