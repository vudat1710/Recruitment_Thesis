module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("Post", {
        title: {
            type: Sequelize.STRING(150)
        },
        gender: {
            type: Sequelize.STRING(20)
        },
        extra_requirements: {
            type: Sequelize.TEXT
        },
        description: {
            type: Sequelize.TEXT
        },
        job_benefits: {
            type: Sequelize.TEXT
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
        num_hiring: {
            type: Sequelize.INTEGER
        },
        valid_through: {
            type: Sequelize.DATE
        },
        address: {
            type: Sequelize.STRING(300)
        },
        post_url: {
            type: Sequelize.STRING(250)
        },
        qualification: {
            type: Sequelize.STRING(70)
        },
        position: {
            type: Sequelize.STRING(70)
        },
        contact_name: {
            type: Sequelize.STRING(100)
        }
    });

    return Post;
};