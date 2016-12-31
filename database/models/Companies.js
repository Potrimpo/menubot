/**
 * Created by lewis.knoxstreader on 24/11/16.
 */

module.exports = function (sequelize, Sequelize) {

    return sequelize.define('Company', {
      fbid: {
        type: Sequelize.BIGINT,
        unique: true,
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
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      timezone: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "+13"
      }, 
      opentime: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "09:00",
      },
      closetime: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "17:00",
      },
      delay: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5
      }
    }, {
      tableName: 'companies',
      timestamps: false,
  });

};
