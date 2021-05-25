module.exports = function (sequelize, DataTypes) {
    const ProductImage = sequelize.define(
      'ProductImage',
      {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true,
        },
        num: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
        },
        fileName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: false,
        },
    },
      {
        tableName: 'ProductImage',
        freezeTableName: false,
        timestamps: false,
        underscored: false,
      }
    )
    ProductImage.associate = (models) => {
        ProductImage.belongsTo(models.Product, {
            as: "images",
            foreignKey: "productId",
        });
    }
    return ProductImage
  }
