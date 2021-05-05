module.exports = function (sequelize, DataTypes) {
    const Category = sequelize.define(
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
        as: "belongs",
        foreignkey: "categoryId",
      });
    }
    return Category
  }