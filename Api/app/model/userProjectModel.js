module.exports = app => {
    const { STRING, INTEGER, TINYINT, DECIMAL, DATE } = app.Sequelize;
    const UserProjectModel = app.model.define('UserProject', {
        Id: { type: INTEGER, autoIncrement: true, primaryKey: true },
        ProjectId: { type: INTEGER },
        ONTID: { type: STRING },
        GetDate: { type: INTEGER },
        TotalAmount: { type: DECIMAL },
        WithdrawAmount: { type: DECIMAL },
        ReceivedAmount: { type: DECIMAL },
        Status: { type: INTEGER },  //0未完成,1:完成但不可领取,2:完成可领取,3:Obtained,4:,5:,6:withdrawing,7:,8:failure,9:completed
        IP: { type: STRING },

        Phone: { type: STRING },
        Email: { type: STRING },
        Address: { type: STRING },
        TelegramUserId: { type: STRING }
    },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: 'Candy_UserProject',
        });

    return UserProjectModel;
}



