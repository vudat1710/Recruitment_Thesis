module.exports = (sequelize, Sequelize) => {
    const MajorPost = sequelize.define("MajorPost", {
        postId: {
            type: Sequelize.INTEGER
        },
        majorId: {
            type: Sequelize.INTEGER
        },
    });

    return MajorPost;
};