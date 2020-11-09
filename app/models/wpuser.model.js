module.exports = (sequelize, Sequelize) => {
    const WorkPlaceUser = sequelize.define("WorkPlaceUser", {
        userId: {
            type: Sequelize.INTEGER
        },
        workPlaceId: {
            type: Sequelize.INTEGER
        },
    });

    return WorkPlaceUser;
};