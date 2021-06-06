module.exports = function (sequelize, DataTypes) {
    var Category = sequelize.define(
      'Category',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          unique: true,
          autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
    }, 
      {
        tableName: 'Category',
        freezeTableName: false,
        timestamps: false,
        underscored: false,
      }
    )
    Category.associate = (models) => {
      Category.hasMany(models.Product, {
        as: "categoryin",
        foreignkey: "categoryinId",
      });
      Category.hasMany(models.Coupon, {
        as: "coupon",
        foreignkey: "categoryId",
      });
    }
    return Category
  }
