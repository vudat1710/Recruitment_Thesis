module.exports = (sequelize, Sequelize) => {
    const PostCompany = sequelize.define("PostCompany", {
        postId: {
            type: Sequelize.INTEGER
        },
        companyId: {
            type: Sequelize.INTEGER
        },
    });

    return PostCompany;
};