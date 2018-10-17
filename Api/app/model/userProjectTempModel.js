module.exports = app => {
    const { STRING, INTEGER, TINYINT, DECIMAL, DATE } = app.Sequelize;
    const UserProjectTempModel = app.model.define('UserProjectTemp', {
        Id: { type: INTEGER, autoIncrement : true, primaryKey: true },
        ProjectId: { type: INTEGER },
        ONTID: { type: STRING },
        Phone: { type: STRING },
        Email: { type: STRING },
        Address: { type: STRING },
        TelegramUserId: { type: STRING }
    },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: 'Candy_UserProjectTemp',
        });

    return UserProjectTempModel;
}



