module.exports = function (sequelize, DataTypes) {
    const Product = sequelize.define(
      'Product',
      {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true,
        },
        title: { //제목
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        designer: { // 0 = ad , 1 = event
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        tag: { // 플레이 방식
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        imageurl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        players: { //이용 가능 인원
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        playtime:{ //플레이 시간
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        difficulty: { //난이도
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        deliveryfee: { // 배송료
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
      {
        tableName: 'Product',
        freezeTableName: false,
        timestamps: false,
        underscored: false,
      }
    )
    Product.associate = (models) => {
        Product.belongsToMany(models.Cart, {
            through: "cart_product",
            as: "carts",
            foreignKey: "cartId",
        });
        Product.belongsTo(models.User, {
            as: "uploaded",
            foreignKey: "uploaderId",
        });
        Product.hasMany(models.PurchaseLog, {
            as: "purchase",
            foreignKey: "productId",
        });
        Product.belongsTo(models.Category, {
            as: "belongs",
            foreignkey: "categoryId",
        });
        Product.hasMany(models.Review, {
            as: "reviews",
            foreignkey: "productId",
        });
    }
    return Product
  }