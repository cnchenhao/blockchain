module.exports = app => {
    const { STRING, INTEGER, TINYINT, DECIMAL, DATE } = app.Sequelize;
    const ProjectSocialMediaModel = app.model.define('ProjectSocialMedia', {
        Id: { type: INTEGER, autoIncrement: true, primaryKey: true },
        ProjectId: { type: INTEGER },
        SocialMediaName: { type: STRING },
        Url: { type: STRING },
        Logo: { type: STRING },
        CreateDate: { type: INTEGER },
    },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: 'Candy_ProjectSocialMedia',
        });

    return ProjectSocialMediaModel;
}



