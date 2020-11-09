module.exports = (sequelize, Sequelize) => {
    const RatePost = sequelize.define("RatePost", {
        postId: {
            type: Sequelize.INTEGER
        },
        value: {
            type: Sequelize.INTEGER
        },
        userId: {
            type: Sequelize.INTEGER
        }
    });

    return RatePost;
};