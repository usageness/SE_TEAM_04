const Sequelize = require('sequelize');

class Eventad extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                unique: true,
                autoIncrement: true,
            },
            title: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            url: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            imageurl: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            start: { // 시작일
                type: Sequelize.DATE,
                allowNull: false,
            },
            end: { // 종료일
                type: Sequelize.DATE,
                allowNull: false,
            },
            flag: { // 0 = ad , 1 = event
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            visible: { // 0 = 볼 수 없음 , 1 = 볼 수 있음
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Eventad',
            tableName: 'eventads',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {}
};

module.exports = Eventad;