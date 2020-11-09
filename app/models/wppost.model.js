module.exports = (sequelize, Sequelize) => {
    const WorkPlacePost = sequelize.define("WorkPlacePost", {
        postId: {
            type: Sequelize.INTEGER
        },
        workPlaceId: {
            type: Sequelize.INTEGER
        },
    });

    return WorkPlacePost;
};