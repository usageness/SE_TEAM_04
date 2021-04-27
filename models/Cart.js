const Sequelize = require('sequelize');

class Cart extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                unique: true,
                autoIncrement: true,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Cart',
            tableName: 'carts',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {}
};

module.exports = Cart;