module.exports = function (sequelize, DataTypes) {
    var Address = sequelize.define(
      'Address',
      {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true,
        },
        address: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
    },
      {
        tableName: 'Address',
        freezeTableName: false,
        timestamps: false,
        underscored: false,
      }
    )
    Address.associate = (models) => {
      Address.belongsTo(models.User, {
        as: "registered_address",
        foreignKey: "userId",
      });
      Address.hasMany(models.PurchaseLog, {
        as: "destination",
        foreignKey: "addressId",
      });
    }
    return Address;
  }
  