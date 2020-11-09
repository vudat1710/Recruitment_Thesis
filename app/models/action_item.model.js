module.exports = (sequelize, Sequelize) => {
    const ActionTypeItem = sequelize.define("ActionTypeItem", {
        userId: {
            type: Sequelize.INTEGER
        },
        actionTypeId: {
            type: Sequelize.INTEGER
        },
        value: {
            type: Sequelize.INTEGER
        }
    });

    return ActionTypeItem;
};