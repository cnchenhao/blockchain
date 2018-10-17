module.exports = app => {
    const { STRING, INTEGER, TINYINT, DECIMAL, DATE } = app.Sequelize;
    const ProjectMissionModel = app.model.define('ProjectMission', {
        Id: { type: INTEGER, autoIncrement: true, primaryKey: true },
        ProjectId: { type: INTEGER },
        MissionId: { type: INTEGER },
        Condition: { type: STRING },
        RefInfo: { type: STRING },
    },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: 'Candy_ProjectMission',
        });

    return ProjectMissionModel;
}