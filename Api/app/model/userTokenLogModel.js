module.exports = app => {
    const { STRING, INTEGER, TINYINT, DECIMAL, DATE } = app.Sequelize;
    const UserTokenLogModel = app.model.define('UserTokenLog', {
        LogId: { type: INTEGER, primaryKey: true },
        ProjectId: { type: INTEGER },
        ONTID: { type: STRING },     
        Action: { type: STRING },           
        Amount: { type: DECIMAL },
        DispAmount: { type: STRING },
        Address: { type: STRING },
        CreateDate: { type: INTEGER },
        Status: { type: INTEGER },
        IP: { type: STRING },
    },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: 'Candy_UserTokenLog',
        });

    return UserTokenLogModel;
}



