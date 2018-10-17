module.exports = app => {
    const { STRING, INTEGER, TINYINT, DECIMAL, DATE } = app.Sequelize;
    const UserProjectMissionModel = app.model.define('UserProjectMission', {
        Id: { type: INTEGER, autoIncrement : true, primaryKey: true },
        ONTID: { type: STRING },
        ProjectId: { type: INTEGER },
        MissionId: { type: INTEGER },
        RefId: { type: STRING },
        RefInfo: { type: STRING },
        CreateDate: { type: INTEGER },
        CompleteDate: { type: INTEGER },
        IsCompleted: { type: TINYINT },
    },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: 'Candy_UserProjectMission',
        });

    return UserProjectMissionModel;
}



