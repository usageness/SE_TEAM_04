

module.exports = function (sequelize, DataTypes) {
    const Eventad = sequelize.define(
      'Eventad',
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
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imageurl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        start: { // 시작일
            type: DataTypes.STRING,
            allowNull: false,
        },
        end: { // 종료일
            type: DataTypes.STRING,
            allowNull: false,
        },
        flag: { // 0 = ad , 1 = event
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        visible: { // 0 = 볼 수 없음 , 1 = 볼 수 있음 , 2= 볼 수 없게함
            type: DataTypes.INTEGER,
            allowNull: false,
        },
      },
      {
        tableName: 'Eventad',
        freezeTableName: false,
        timestamps: false,
        underscored: false,
      }
    )
    Eventad.associate = (models) => {
      Eventad.belongsTo(models.User, {
            as: 'creator', 
            foreignKey: 'creatorId',
            constraints: false 
        });
    }
    return Eventad
  }
  