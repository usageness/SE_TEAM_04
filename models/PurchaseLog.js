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
        },
        status: { // 0 - 결제 전, 1 - 결제 완료, 2 - 배송중, 3 - 배송 완료, 4 - 구매확정
          type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
            defaultValue: 0
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
      PurchaseLog.hasOne(models.Review, {
        as: "reviews",
        foreignkey: "purcahseLogId",
      });
      /*
      PurchaseLog.hasMany(models.Inquiry, {
        as: "QNA",
        foreignkey: "purcahseLogId",
      });
      */
    }
    
    return PurchaseLog;
  }
  