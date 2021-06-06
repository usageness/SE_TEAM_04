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
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0, // 0 - before pay, 1 - ready pay, 2 - ended pay
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
