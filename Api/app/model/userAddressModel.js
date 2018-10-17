module.exports = app => {
    const { STRING, INTEGER, TINYINT, DECIMAL, DATE } = app.Sequelize;
    const UserAddressModel = app.model.define('UserAddress', {
        id: { type: INTEGER, autoIncrement: true, primaryKey: true },
        ONTID: { type: STRING },
        BlockChainName: { type: STRING },
        Address: { type: STRING },
        CreateDate: { type: INTEGER },

        //Logo: { type: STRING },
    },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: 'UserAddress',
        });

    return UserAddressModel;
}



