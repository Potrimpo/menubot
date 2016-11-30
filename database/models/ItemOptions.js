/**
 * Created by BIG D on whene/ver/yo.
 */

// Heed my warning! ItemOption, when referenced in sequelize queries must be surrounded by escaped double quotes \"like so\"

module.exports = function (sequelize, Sequelize) {

  return sequelize.define('ItemOption', {
    itemid: {
      type: Sequelize.INTEGER,
      references: {
        model: 'items',
        key: 'itemid'
      },
    },
    optionid: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    option: {
      type: Sequelize.STRING
    },
    option_price: {
      type: Sequelize.DECIMAL
    }
  }, {
    tableName: 'itemOptions',
    timestamps: false,
  });

};
