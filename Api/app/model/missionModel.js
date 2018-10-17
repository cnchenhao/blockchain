module.exports = app => {
    const { STRING, INTEGER, TINYINT, DECIMAL, DATE } = app.Sequelize;
    const MissionModel = app.model.define('Mission', {
        MissionId: { type: INTEGER, primaryKey: true },
        MissionCode: { type: STRING },
        //Goal: { type: STRING },
        Pic: { type: STRING },
        Status: { type: INTEGER },
        // Creator: { type: STRING },
        // CreateDate: { type: DATE },
        // Modifier: { type: STRING },
        // ModifyDate: { type: DATE },
        Language: { type: STRING },
        MissionName: { type: STRING },
        Description: { type: STRING },
        Sort: { type: INTEGER },

        RefInfo: {type: STRING},  //用于存放例如：Telegram的Group邀请链接

        Condition:{type: STRING},
        
        IsCompleted: { type: TINYINT },
    },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: 'Candy_Mission',
        });

    return MissionModel;
}



