module.exports = function (sequelize, DataTypes) {
    var Admin= sequelize.define(
      'Admin',
      {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true,
        },
        adminid: {
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
        tableName: 'Admin',
        freezeTableName: false,
        timestamps: false,
        underscored: false,
      }
    )
    Admin.associate = (models) => {
     
    }
    return Admin;
  }