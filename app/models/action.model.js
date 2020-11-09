module.exports = (sequelize, Sequelize) => {
    const ActionType = sequelize.define("ActionType", {
        name: {
            type: Sequelize.STRING(20)
        },
    });

    return ActionType;
};