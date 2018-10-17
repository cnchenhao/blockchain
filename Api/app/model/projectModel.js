module.exports = app => {
    const { STRING, INTEGER, TINYINT, DECIMAL, DATE } = app.Sequelize;
    const ProjectModel = app.model.define('Project', {
        ProjectId: { type: INTEGER, primaryKey: true },
        Logo: { type: STRING },
        //IsTop: { type: TINYINT },
        IsHot: { type: TINYINT },
        //Sort: { type: INTEGER },
        IsAutomatic: { type: TINYINT },
        BlockChainName: { type: STRING },
        BlockChainLogo: { type: STRING },
        TokenName: { type: STRING },
        TokenStandard: { type: STRING }, //ERC721、ERC200
        TotalAmount: { type: DECIMAL },
        DailyMaxAmount: { type: DECIMAL },  //DailyMaxAmount==0：不做限制
        OnceAmount: { type: DECIMAL },
        SentTotalAmount: { type: DECIMAL },
        Participants: { type: INTEGER },
        StartDate: { type: INTEGER },
        EndDate: { type: INTEGER },
        Status: { type: INTEGER },     //getProjectList接口解释1：no going, 2：obtained；3：expired;因此状态是整合了EndDate，与数据库的不一致。只用于返回给客户端
        Website: { type: STRING },
        Creator: { type: STRING },
        CreateDate: { type: DATE },
        Modifier: { type: STRING },
        ModifyDate: { type: DATE },
        ONTID: { type: STRING },
        Language: { type: STRING },
        ProjectName: { type: STRING },
        Brief: { type: STRING },
        Description: { type: STRING },
        AirdropRule: { type: STRING },

        // ObtainTotalCount: { type: INTEGER },  //已领取人数
        // ObtainDailyCount: { type: INTEGER },  //每日领取人数
        DailyObtainTotalAmount: { type: DECIMAL },  //每日领取的总数
        ObtainStatus: { type: INTEGER },      //领取状态 //0未完成,1:完成但不可领取,2:完成可领取,3:Obtained,4:,5:,6:withdrawing,7:,8:failure,9:completed
    },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: 'Candy_Project',
        });

    return ProjectModel;
};



