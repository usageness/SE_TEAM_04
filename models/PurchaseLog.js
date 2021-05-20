module.exports = function (sequelize, DataTypes) {
    var PurchaseLog = sequelize.define(
      'PurchaseLog',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          unique: true,
          autoIncrement: true,
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
          unique: false,
        },
        count: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: false,
        },
        logId: {
          type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
        },
        amount: {
          type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
        }
    },
      {
        tableName: 'PurchaseLog',
        freezeTableName: false,
        timestamps: false,
        underscored: false,
      }
    )
    PurchaseLog.associate = (models) => {
      PurchaseLog.belongsTo(models.User, {
        as: "log",
        foreignKey: "userId",
      });
      PurchaseLog.belongsTo(models.Address, {
        as: "destination",
        foreignKey: "addressId",
      });
      PurchaseLog.belongsTo(models.Product, {
        as: "purchase",
        foreignKey: "productId",
      });
    }
    
    return PurchaseLog;
  }
  