module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define(
      'User',
      {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true,
        },
        nickname: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        userid: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        permission:{ //0: user, 1: admin
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        createat: { // 시작일
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
      {
        tableName: 'User',
        freezeTableName: false,
        timestamps: false,
        underscored: false,
      }
    )
    User.associate = (models) => {
      User.hasMany(models.Eventad, {
        foreignKey: 'creatorId',
        onDelete: 'cascade'
      });
      User.hasOne(models.Cart, {
        foreignKey: 'userId',
        onDelete: 'cascade'
      });
      User.hasMany(models.Address, {
        as: "addresses",
        foreignKey: "userId",
      });
      User.hasMany(models.PurchaseLog, {
        as: "purchaselog",
        foreignKey: "userId",
      });
      User.hasMany(models.Review, {
        as: "review",
        foreignKey: "userId",
      });
    }
    return User;
  }