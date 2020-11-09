module.exports = (sequelize, Sequelize) => {
    const WishList = sequelize.define("WishList", {
        postId: {
            type: Sequelize.INTEGER
        },
        userId: {
            type: Sequelize.INTEGER
        },
    });

    return WishList;
};