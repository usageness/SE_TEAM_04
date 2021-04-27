module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define(
      'User',
      {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true,
        },
        userid: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createat: { // 시작일
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
      {
        tableName: 'User',
        freezeTableName: false,
        timestamps: false,
        underscored: false,
      }
    )
    User.associate = (models) => {
     
    }
    return User;
  }