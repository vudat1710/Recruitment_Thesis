module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        user_name: {
            type: Sequelize.STRING(100)
        },
        gender: {
            type: Sequelize.STRING(20)
        },
        password: {
            type: Sequelize.STRING(45)
        },
        salary: {
            type: Sequelize.STRING(30)
        },
        experience: {
            type: Sequelize.STRING(50)
        },
        job_type: {
            type: Sequelize.STRING(30)
        },
        year_of_birth: {
            type: Sequelize.INTEGER
        },
        qualification: {
            type: Sequelize.STRING(70)
        },
        is_lock: {
            type: Sequelize.BOOLEAN
        }
    });

    return User;
};