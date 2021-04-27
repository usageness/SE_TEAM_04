module.exports = function (sequelize, DataTypes) {
    const Review = sequelize.define(
      'Review',
      {
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
    }, 
      {
        tableName: 'Review',
        freezeTableName: false,
        timestamps: false,
        underscored: false,
      }
    )
    Review.associate = (models) => {
     
    }
    return Review
  }