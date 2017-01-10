/**
 * Created by lewis.knoxstreader on 24/11/16.
 */

module.exports = function (sequelize, Sequelize) {

  return sequelize.define('User', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    facebookId: {
      type: Sequelize.STRING,
      unique: true
    },
    name: Sequelize.STRING,
    photo: Sequelize.STRING,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      isEmail: true
    },
    accounts: Sequelize.JSON,
    token: Sequelize.STRING,
  }, {
    tableName: 'pl_users',
    indexes: [
      {
        name: 'facebookIdIndex',
        method: 'BTREE',
        fields: ['facebookId']
      }
    ]
  });

};
