module.exports = function (sequelize, DataTypes) {
  var Address = sequelize.define(
    "Address",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(70),
        allowNull: false,
      },
      detailesAddress: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      isChecked:{
        type: DataTypes.BOOLEAN,
        allowNull:false,
      }
    },
    {
      tableName: "Address",
      freezeTableName: false,
      timestamps: false,
      underscored: false,
    }
  );
  Address.associate = (models) => {
    Address.belongsTo(models.User, {
      as: "registered_address",
      foreignKey: "userId",
    });
    Address.hasMany(models.PurchaseLog, {
      as: "destination",
      foreignKey: "addressId",
    });
  };
  return Address;
};
