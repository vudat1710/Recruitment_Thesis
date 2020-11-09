module.exports = (sequelize, Sequelize) => {
    const Major = sequelize.define("Major", {
        name: {
            type: Sequelize.STRING(70)
        },
    });

    return Major;
};