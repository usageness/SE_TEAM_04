module.exports = function (sequelize, DataTypes) {
    var Coupon_User = sequelize.define(
      'Coupon_User',
      {
        used: {
            type: DataTypes.BOOLEAN,
            primaryKey: true,
            allowNull: false,
            defaultValue: false
        },
      },
      {
        tableName: 'Coupon_User',
        freezeTableName: false,
        timestamps: true,
        underscored: false,
      }
    )
    Coupon_User.associate = (models) => {
    }
    return Coupon_User;
  }
