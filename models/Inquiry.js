const PurchaseLog = require("./PurchaseLog")

module.exports = function (sequelize, DataTypes) {
    const Inquiry = sequelize.define(
      'Inquiry',
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
      content: {
          type: DataTypes.TEXT,
          allowNull: true,
      },
      date: { // 작성일
          type: DataTypes.DATE,
          allowNull: false,
      },
      Type: { // 0 - 질문, 1 - 답변
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      inquiryId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
    },
      logId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      PurchaseLogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, 
      {
        tableName: 'Inquiry',
        freezeTableName: false,
        timestamps: false,
        underscored: false,
      }
    )
    
    Inquiry.associate = (models) => {
      Inquiry.hasOne(models.Inquiry, {
        as: "answer",
        foreignKey: "inquiryId",
      });
      Inquiry.belongsTo(models.PurchaseLog, {
        as: "log"
      });
    } 
    return Inquiry
  }
