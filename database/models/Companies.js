/**
 * Created by lewis.knoxstreader on 24/11/16.
 */

module.exports = function (sequelize, Sequelize) {

    return sequelize.define('Company', {
    fbid: {
      type: Sequelize.BIGINT,
      unique: true,
      allowNull: false,
      primaryKey: true
    },
    access_token: {
      type: Sequelize.STRING,
      allowNull: false
    },
    bot_status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    location: Sequelize.STRING,
    opentime: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "9am",
    },
    closetime: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "10pm",
    }
  }, {
    tableName: 'companies',
    timestamps: false,
  });

};
