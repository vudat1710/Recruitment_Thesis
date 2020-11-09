module.exports = (sequelize, Sequelize) => {
    const WorkPlace = sequelize.define("WorkPlace", {
        name: {
            type: Sequelize.STRING(30)
        },
    });

    return WorkPlace;
};