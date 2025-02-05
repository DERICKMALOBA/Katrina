const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Offer = sequelize.define("Offer", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  discount: { type: DataTypes.DATE, allowNull: false },
  validFrom: { type: DataTypes.DATE, allowNull: false },
  validTo: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM("Active", "Expired"), defaultValue: "Active" },
});

// Sync the table with the database
(async () => {
  await sequelize.sync();
})();

module.exports = Offer;
