module.exports = (sequelize, Sequelize) => {
    const CommentPost = sequelize.define("CommentPost", {
        postId: {
            type: Sequelize.INTEGER
        },
        content: {
            type: Sequelize.TEXT
        },
        userId: {
            type: Sequelize.INTEGER
        }
    });

    return CommentPost;
};