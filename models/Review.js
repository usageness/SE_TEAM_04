const Sequelize = require('sequelize');

class Review extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            score: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            date: { // 작성일
                type: Sequelize.DATE,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Review',
            tableName: 'reviews',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {}
};

module.exports = Review;