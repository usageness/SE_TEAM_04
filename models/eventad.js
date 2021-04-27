

module.exports = function (sequelize, DataTypes) {
    const Eventad = sequelize.define(
      'Eventad',
      {
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
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
            type: DataTypes.DATE,
            allowNull: false,
        },
        end: { // 종료일
            type: DataTypes.DATE,
            allowNull: false,
        },
        flag: { // 0 = ad , 1 = event
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        visible: { // 0 = 볼 수 없음 , 1 = 볼 수 있음
            type: DataTypes.BOOLEAN,
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
        
    }
    return Eventad
  }
  