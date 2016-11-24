/**
 * Created by lewis.knoxstreader on 24/11/16.
 */

const sessionTable = process.env.sessionTable;

// Sessions for users on the site
module.exports = function (sequelize, Sequelize) {

  return sequelize.define('Session', {
    sid: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    sess: {
      type: Sequelize.JSON,
      allowNull: false
    },
    expire: {
      type: Sequelize.DATE(6),
      allowNull: false
    }
  }, {
    tableName: sessionTable,
    timestamps: false
  });

};
