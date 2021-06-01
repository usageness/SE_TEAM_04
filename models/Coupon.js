module.exports = function (sequelize, DataTypes) {
    const Coupon = sequelize.define(
      'Coupon',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          unique: true,
          autoIncrement: true,
      },
      code: { // /coupon/:code 로 접속시 쿠폰 발급하는 방식. 알파벳으로 된 적당한 코드.
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      minPrice: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      discountStatic: { // 2000원 => 2000으로 입력
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      discountPercent: { // 20% => 20으로 입력
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      maxDiscount: { // 2000원 => 2000으로 입력
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      date: { // 쿠폰 생성일
          type: DataTypes.DATE,
          allowNull: false,
      },
      type: { // 1 - minPrice 이상 구매 시 discountStatic 할인, 2 - 카테고리(categoryId) 포함 시 (discountPercent/100) % 할인 최대 maxDiscount원 할인
          type: DataTypes.INTEGER,
          allowNull: false,
      },
    }, 
      {
        tableName: 'Coupon',
        freezeTableName: false,
        timestamps: false,
        underscored: false,
      }
    )
    Coupon.associate = (models) => {
      Coupon.belongsToMany(models.User, {
        as: "user",
        through: "Coupon_User",
      });
    }
    return Coupon
  }
