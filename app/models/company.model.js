module.exports = (sequelize, Sequelize) => {
    const Company = sequelize.define("Company", {
        name: {
            type: Sequelize.STRING(200)
        },
        description: {
            type: Sequelize.TEXT
        },
        address: {
            type: Sequelize.STRING(300)
        },
        img_url: {
            type: Sequelize.STRING(400)
        },
    });

    return Company;
};