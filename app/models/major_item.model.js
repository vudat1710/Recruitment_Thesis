module.exports = (sequelize, Sequelize) => {
    const MajorItem = sequelize.define("MajorItem", {
        majorId: {
            type: Sequelize.INTEGER
        },
        userId: {
            type: Sequelize.INTEGER
        },
    });

    return MajorItem;
};