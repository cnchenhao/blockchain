module.exports = app => {
    const { STRING, INTEGER, TINYINT, DECIMAL, DATE } = app.Sequelize;
    const RuledMissionModel = app.model.define('RuledMission', {
        JoinId: { type: INTEGER },
        Status: { type: INTEGER },
        IsCompleted: { type: TINYINT },
        ProjectId: { type: INTEGER },
        MissionId: { type: INTEGER },
        MissionCode: { type: STRING },
        Condition: { type: STRING },
        ProjectStatus: { type: INTEGER },
        ONTID: { type: STRING },
    },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: 'Candy_RuledMission',
        });

    return RuledMissionModel;
}



