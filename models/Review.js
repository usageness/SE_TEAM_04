module.exports = function (sequelize, DataTypes) {
    const Review = sequelize.define(
      'Review',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          unique: true,
          autoIncrement: true,
      },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        score: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        date: { // 작성일
          type: DataTypes.DATE,
          allowNull: false,
        },
        like: { 
          type: DataTypes.BOOLEAN,
          allowNull: false,
        }
    }, 
      {
        tableName: 'Review',
        freezeTableName: false,
        timestamps: false,
        underscored: false,
      }
    )
    Review.associate = (models) => {
      Review.belongsTo(models.Product, {
      });
      Review.belongsTo(models.User, {
        as: "user",
      });
    }
    return Review
  }
