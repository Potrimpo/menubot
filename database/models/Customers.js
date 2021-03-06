module.exports = function (sequelize, Sequelize) {

  return sequelize.define('Customer', {
    customer_id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
    },
    profile_pic: Sequelize.STRING,
    customer_name: Sequelize.STRING
  }, {
    tableName: 'customers',
    timestamps: false
  });

};
