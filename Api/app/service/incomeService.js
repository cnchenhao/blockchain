const Service = require('egg').Service;

class IncomeService extends Service {
    //账户页列表
    async getIncomeBrief(ontid) {
        let incomelist = await this.getIncomeList(ontid, 0, 100);
        let recordist = await this.getRecordList(ontid, 0, 5);
        let addresslist = await this.getAddressList(ontid, 0, 3);
        return { Balance: incomelist.rows, Record: recordist.rows, Address: addresslist.rows };
    };

    //获取余额列表
    async getIncomeList(ontid, offset, limit) {
        const ctx = this.ctx;
        const imghost = this.config.assetSlices.hostDomain;
        var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;

        let sql = ' SELECT ROUND(cup.TotalAmount) AS TotalAmount, p.ProjectId, p.TokenName, p.Logo, p.BlockChainName FROM Candy_UserProject cup '
            + ' INNER JOIN Candy_Project p ON p.ProjectId = cup.ProjectId  '
            + ' WHERE cup.`Status` = 3 AND cup.ONTID = :ONTID '
            + ' LIMIT :offset, :limit ';

        let dbrows = await ctx.model.query(sql, { raw: true, model: ctx.model.UserProjectModel, replacements: { ONTID: ontid, offset, limit } });
        let count = await ctx.model.UserProjectModel.count({ where: { ONTID: ontid, Status: 3 } });

        let rows = [];
        if (dbrows != null && dbrows.length > 0) {
            dbrows.forEach(function (item, i) {
                rows.push({
                    ProjectId: item.ProjectId,
                    Logo: reg.test(item.Logo) ? item.Logo : (imghost + item.Logo),
                    TotalAmount: item.TotalAmount,
                    TokenName: item.TokenName,
                    BlockChainName: item.BlockChainName,
                });
            });
        }

        let pageCount = Math.ceil(count / limit);
        return { count, pageCount, rows };
    };

    //获取记录列表
    async getRecordList(ontid, offset, limit) {
        const ctx = this.ctx;
        const imghost = this.config.assetSlices.hostDomain;

        let sql = ' SELECT ulog.CreateDate, ulog.`Status`, p.ProjectId, p.TokenName, p.Logo, '
            + " CASE WHEN ulog.Action = 'in' THEN CONCAT('+', ROUND(ulog.Amount)) WHEN ulog.Action = 'out' THEN CONCAT('-', ROUND(ulog.Amount)) END DispAmount "
            + ' FROM Candy_UserTokenLog ulog '
            + ' LEFT JOIN Candy_Project p ON p.ProjectId = ulog.ProjectId '
            + ' WHERE ulog.ONTID = :ONTID '
            + ' ORDER BY ulog.CreateDate DESC, ulog.LogId '
            + ' LIMIT :offset, :limit ';

        let count = await ctx.model.UserTokenLogModel.count({ where: { ONTID: ontid } });
        let dbrows = await ctx.model.query(sql, { raw: true, model: ctx.model.UserTokenLogModel, replacements: { ONTID: ontid, offset, limit } });
        let rows = [];
        if (dbrows != null && dbrows.length > 0) {
            dbrows.forEach(function (item, i) {
                rows.push({
                    DispAmount: item.DispAmount,
                    TokenName: item.TokenName,
                    Logo: imghost + item.Logo,
                    Status: item.Status,
                    CreateDate: item.CreateDate,
                    ProjectId: item.ProjectId,
                });
            });
        }

        let pageCount = Math.ceil(count / limit);
        return { count, pageCount, rows };
    };

    //获取地址列表
    async getAddressList(ontid, offset, limit) {
        const ctx = this.ctx;
        const imghost = this.config.assetSlices.hostDomain;

        let sql = 'SELECT ua.Address, ua.BlockChainName, bc.Logo FROM UserAddress ua '
            + ' LEFT JOIN BlockChain bc ON bc.ShortName = ua.BlockChainName '
            + ' WHERE ua.ONTID = :ONTID LIMIT :offset, :limit';

        let count = await ctx.model.UserAddressModel.count({ where: { ONTID: ontid } });
        let dbrows = await ctx.model.query(sql, { raw: true, model: ctx.model.UserAddressModel, replacements: { ONTID: ontid, offset, limit } });
        let rows = [];
        if (dbrows != null && dbrows.length > 0) {
            dbrows.forEach(function (item, i) {
                rows.push({
                    Address: item.Address,
                    BlockChainName: item.BlockChainName,
                    Logo: imghost + item.Logo,
                });
            });
        }

        let pageCount = Math.ceil(count / limit);
        return { count, pageCount, rows };
    };

    //提币时获取地址列表
    async getWithdrawAddressList(ontid, projectId, offset, limit) {
        const ctx = this.ctx;
        const imghost = this.config.assetSlices.hostDomain;

        let sql = 'SELECT ua.Address, ua.BlockChainName, bc.Logo FROM UserAddress ua '
            + ' LEFT JOIN BlockChain bc ON bc.ShortName = ua.BlockChainName '
            + ' INNER JOIN Candy_Project p ON p.BlockChainName = ua.BlockChainName AND p.ProjectId = :ProjectId '
            + ' WHERE ua.ONTID = :ONTID LIMIT :offset, :limit';

        //let count = await ctx.model.UserAddressModel.count({ where: { ONTID: ontid } });
        let dbrows = await ctx.model.query(sql, { raw: true, model: ctx.model.UserAddressModel, replacements: { ONTID: ontid, ProjectId: projectId, offset, limit } });
        let rows = [];
        if (dbrows != null && dbrows.length > 0) {
            dbrows.forEach(function (item, i) {
                rows.push({
                    Address: item.Address,
                    BlockChainName: item.BlockChainName,
                    Logo: imghost + item.Logo,
                });
            });
        }
        //todo: 并没有分页功能
        let count = rows.length;
        let pageCount = Math.ceil(count / limit);
        return { count, pageCount, rows };

    };

    //提币请求
    async saveWithdraw(data) {
        const ctx = this.ctx;

        let sql = ' SELECT cup.TotalAmount, p.BlockChainName, cup.`Status`, cup.ProjectId FROM Candy_UserProject cup '
            + ' LEFT JOIN Candy_Project p ON p.ProjectId = cup.ProjectId '
            + ' WHERE cup.`Status` = 3 AND cup.ONTID = :ONTID AND cup.ProjectId = :ProjectId';
        let uprows = await ctx.model.query(sql, { raw: true, model: ctx.model.UserProjectModel, replacements: { ONTID: data.ONTID, ProjectId: data.ProjectId } });
        if (uprows == null || uprows.length == 0) {
            return -1;  //项目不存在/项目未完成/已领取  返回-1
        }

        const trans = await ctx.model.transaction();
        let affectedRows = 0;
        try {
            let userproject = uprows[0];
            let userUpdate = await ctx.model.UserProjectModel.update({ Status: 6 }, { where: { ONTID: data.ONTID, ProjectId: data.ProjectId, Status: 3 }, transaction: trans });
            if (userUpdate != null && userUpdate.length > 0 && userUpdate[0] > 0) {
                affectedRows++;
            }
            else {
                trans.rollback();
                return -1; //更新失败：已领取  返回-1
            }

            //将钱包地址插入Address表
            let addressinfo = {
                ONTID: data.ONTID,
                BlockChainName: userproject.BlockChainName,
                Address: data.Address,
                CreateDate: Math.floor(Date.now() / 1000),
            };
            let addressCreate = await ctx.model.UserAddressModel.findOrCreate({ where: { Address: data.Address, ONTID: data.ONTID }, defaults: addressinfo, transaction: trans });
            if (addressCreate != null && addressCreate.length > 1 && addressCreate[1] == true) {
                affectedRows++;
            }

            //将提币日志写入TokenLog表
            let log = {
                ProjectId: data.ProjectId,
                ONTID: data.ONTID,
                Action: 'out',
                Amount: userproject.TotalAmount,
                Address: data.Address,
                CreateDate: Math.floor(Date.now() / 1000),
                Status: 1,
                IP: ctx.ip,
            };
            let logcreate = await ctx.model.UserTokenLogModel.create(log, { transaction: trans });
            if (logcreate != null && logcreate.ProjectId != 0) {
                affectedRows++;
            }
            trans.commit();
        }
        catch (err) {
            trans.rollback();
            affectedRows = -2;//提币出错，返回-2
        }
        return affectedRows;
    };
}

module.exports = IncomeService;