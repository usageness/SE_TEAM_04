module.exports = function (sequelize, DataTypes) {
    var Cart = sequelize.define(
      'Cart',
      {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
            defaultValue: 1,
        },
    }, 
      {
        tableName: 'Cart',
        freezeTableName: false,
        timestamps: false,
        underscored: false,
      }
    )
    Cart.associate = (models) => {
      Cart.belongsToMany(models.Product, {
        through: "cart_product",
        as: "products",
        foreignKey: "productId",
      })
    }
    return Cart;
  }
