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
    }, 
      {
        tableName: 'Cart',
        freezeTableName: false,
        timestamps: false,
        underscored: false,
      }
    )
    Cart.associate = (models) => {
     
    }
    return Cart;
  }