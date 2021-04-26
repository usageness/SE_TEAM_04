const Sequelize = require('sequelize');

class Product extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            designer: { // 0 = ad , 1 = event
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            tag: { // 플레이 방식
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            imageurl: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            url: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            price: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            players: { //이용 가능 인원
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            playtime:{ //플레이 시간
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            difficulty: { //난이도
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            deliveryfee: { // 배송료
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Product',
            tableName: 'products',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {}
};

module.exports = Product;