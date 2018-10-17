module.exports = app => {
    const { STRING, INTEGER, TINYINT, DECIMAL, DATE } = app.Sequelize;
    const UserModel = app.model.define('User', {
        ONTID: { type: STRING, primaryKey: true },
        PKey: { type: STRING },
        IsCertification: { type: TINYINT },
        Status: { type: TINYINT },
    },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: 'User',
        });

    return UserModel;
}
