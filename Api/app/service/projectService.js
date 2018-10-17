const Service = require('egg').Service;
var Decimal = require('decimal.js');

class ProjectService extends Service {
    //获取项目列表
    async getProjectList(lang, ontId, offset, limit) {
        const ctx = this.ctx;
        const imghost = this.config.assetSlices.hostDomain;
        var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;

        let sql = 'SELECT '
            + ' p.ProjectId, p.Logo, p.IsTop, p.IsHot, p.Sort, p.BlockChainName, p.TokenName, p.TokenStandard, p.StartDate, p.EndDate, '
            + ' CASE WHEN EndDate < UNIX_TIMESTAMP() THEN 3 WHEN up.`Status` >= 3 THEN 2 WHEN p.`Status` = 3 THEN 1 ELSE p.`Status` END `Status`, '
            + ' plang.`Language`, plang.ProjectName, plang.Brief, plang.Description, bc.Logo AS BlockChainLogo '
            //+ ' up.`Status` AS ObtainStatus '
            + ' FROM Candy_Project AS p '
            + ' LEFT JOIN Candy_ProjectMultilanguage plang ON p.ProjectId = plang.ProjectId '
            + ' LEFT JOIN ( SELECT ProjectId, `Status` FROM Candy_UserProject WHERE ONTID = :ONTID ) AS up ON up.ProjectId = p.ProjectId '
            + ' LEFT JOIN BlockChain bc ON bc.ShortName = p.BlockChainName '
            + ' WHERE plang.`Language` =:Language AND p.`Status` = 3 '
            + ' ORDER BY IsTop DESC, IsHot DESC, Sort DESC, EndDate DESC, ProjectId '
            + ' LIMIT :offset, :limit ';
        let where = { Status: 3 };
        let count = await ctx.model.ProjectModel.count({ where: where });
        let dbrows = await ctx.model.query(sql, { raw: true, model: ctx.model.ProjectModel, replacements: { Language: lang, ONTID: ontId, offset, limit } });
        let rows = [];
        if (dbrows != null && dbrows.length > 0) {
            dbrows.forEach(function (item, i) {
                rows.push({
                    ProjectId: item.ProjectId,
                    Logo: reg.test(item.Logo) ? item.Logo : (imghost + item.Logo),
                    IsHot: item.IsHot,
                    BlockChainName: item.BlockChainName,
                    BlockChainLogo: imghost + item.BlockChainLogo,
                    TokenName: item.TokenName,
                    TokenStandard: item.TokenStandard, //ERC721、ERC200        
                    Status: item.Status,     //getProjectList接口解释1：no going, 2：obtained；3：expired;        
                    //Language: item.Language,
                    ProjectName: item.ProjectName,
                    Brief: item.Brief,
                });
            });
        }

        let pageCount = Math.ceil(count / limit);
        return { count, pageCount, rows };
    };

    //获取项目详情
    async getProjectDetail(data) {
        const ctx = this.ctx;
        const imghost = this.config.assetSlices.hostDomain;
        var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;

        let prosql = 'SELECT '
            + ' p.ProjectId, p.Logo, p.IsTop, p.IsHot, p.Sort, p.ONTID, '
            + ' p.BlockChainName, p.TokenName, p.TokenStandard, ROUND(p.TotalAmount) AS TotalAmount, ROUND(p.DailyMaxAmount) AS DailyMaxAmount, '
            + ' ROUND(p.OnceAmount) AS OnceAmount, ROUND(p.SentTotalAmount) AS SentTotalAmount, p.Participants, '
            + ' p.StartDate, p.EndDate, '
            + ' CASE WHEN EndDate < UNIX_TIMESTAMP() THEN 3 WHEN up.`Status` >= 3 THEN 2 WHEN p.`Status` = 3 THEN 1 ELSE p.`Status` END `Status`, '
            + ' p.Website, '
            + ' plang.`Language`, plang.ProjectName, plang.Brief, plang.Description, plang.AirdropRule, '
            + " ( SELECT SUM(TotalAmount) FROM Candy_UserProject WHERE ProjectId = :ProjectId "
            + " AND GetDate >= UNIX_TIMESTAMP(DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00')) AND GetDate <= UNIX_TIMESTAMP(DATE_FORMAT(NOW(), '%Y-%m-%d 23:59:59')) ) AS DailyObtainTotalAmount, "
            + ' CASE WHEN up.`Status` IS NULL THEN 0 ELSE up.`Status` END ObtainStatus '
            + ' FROM Candy_Project p '
            + ' LEFT JOIN Candy_ProjectMultilanguage plang ON p.ProjectId = plang.ProjectId '
            + ' LEFT JOIN ( SELECT ProjectId, `Status` FROM Candy_UserProject WHERE ONTID = :ONTID ) AS up ON up.ProjectId = p.ProjectId '
            + ' WHERE plang.`Language` =:Language AND p.ProjectId=:ProjectId AND p.`Status` = 3 ';

        let misssql = 'SELECT '
            + ' m.MissionId, m.MissionCode, m.Pic, m.`Status`, m.Sort, pm.Condition, pm.RefInfo, mlang.`Language`, mlang.MissionName, mlang.Description, '
            + '  CASE WHEN (upm.IsCompleted IS NULL OR upm.IsCompleted = 0) THEN 0 ELSE 1 END IsCompleted, upm.CompleteDate '
            + ' FROM Candy_ProjectMission AS pm '
            + ' LEFT JOIN Candy_Mission m ON m.MissionId = pm.MissionId '
            + ' LEFT JOIN Candy_MissionMultilanguage mlang ON mlang.MissionId = m.MissionId '
            + ' LEFT JOIN ( SELECT ProjectId, MissionId, IsCompleted, CompleteDate FROM Candy_UserProjectMission WHERE ONTID = :ONTID AND ProjectId = :ProjectId '
            + ' ) AS upm ON upm.MissionId = pm.MissionId '
            + ' WHERE pm.ProjectId = :ProjectId AND m.`Status` = 1 AND mlang.`Language`= :Language '
            + ' ORDER BY Sort DESC, MissionId ';

        let socialsql = 'SELECT pm.SocialMediaName, pm.Url, m.Logo '
            + ' FROM Candy_ProjectSocialMedia pm '
            + ' LEFT JOIN Candy_SocialMedia m  ON m.SocialMediaName = pm.SocialMediaName '
            + ' WHERE pm.ProjectId = :ProjectId '
            + ' ORDER BY pm.Sort DESC, pm.Id ';

        //prolist[0]项目详情（包含多语言和对Status的判断）
        let prolist = await ctx.model.query(prosql, { raw: true, model: ctx.model.ProjectModel, replacements: { Language: data.Lang, ONTID: data.ONTID, ProjectId: data.ProjectId } });
        //本项目的所有任务
        let misslist = await ctx.model.query(misssql, { raw: true, model: ctx.model.MissionModel, replacements: { Language: data.Lang, ONTID: data.ONTID, ProjectId: data.ProjectId } });
        //本项目的所有社交媒体
        let sociallist = await ctx.model.query(socialsql, { raw: true, model: ctx.model.ProjectSocialMediaModel, replacements: { ProjectId: data.ProjectId } });
        
        //项目状态，领取状态、每日已领取的总金额
        let _projectStatus = 0, _obtainStatus = 0, _dailyObtainTotalAmount = 0;

        let result = {};
        if (prolist != null && prolist.length > 0) {
            let onepro = prolist[0];
            result.ProjectId = onepro.ProjectId;
            result.Logo = reg.test(onepro.Logo) ? onepro.Logo : (imghost + onepro.Logo);
            result.IsHot = onepro.IsHot;
            result.BlockChainName = onepro.BlockChainName;
            result.TokenName = onepro.TokenName;
            result.TokenStandard = onepro.TokenStandard; //ERC721、ERC200     
            result.TotalAmount = onepro.TotalAmount;
            result.DailyMaxAmount = onepro.DailyMaxAmount;
            result.OnceAmount = onepro.OnceAmount;
            result.SentTotalAmount = onepro.SentTotalAmount;
            result.Participants = onepro.Participants;
            result.StartDate = onepro.StartDate;
            result.EndDate = onepro.EndDate;
            //result.Status = onepro.Status;            //getProjectList接口解释1：no going, 2：obtained；3：expired;
            result.Website = onepro.Website;
            result.ONTID = onepro.ONTID;
            //result.Language = onepro.Language;
            result.ProjectName = onepro.ProjectName;
            result.Brief = onepro.Brief;
            result.Description = onepro.Description;
            result.AirdropRule = onepro.AirdropRule;
            result.DispStatus = 0;                      //整合状态 //1：按钮可用, 2：按钮可见不可用；3：按钮不可见; 0...其他值：按钮不可见

            _projectStatus = onepro.Status;             //1：no going, 2：obtained；3：expired;  
            _obtainStatus = onepro.ObtainStatus;        //(-2完成但超出总额度，-1完成但超出每天额度，0未完成,2:完成可领取,3:Obtained,4:,5:,6:withdrawing,7:,8:failure,9:completed)
            _dailyObtainTotalAmount = new Decimal((onepro.DailyObtainTotalAmount == undefined || onepro.DailyObtainTotalAmount == null || onepro.DailyObtainTotalAmount == '') ? 0 : onepro.DailyObtainTotalAmount);

            //社交媒体
            if (sociallist != null && sociallist.length > 0) {
                sociallist.forEach(function (item, i) {
                    item.Logo = imghost + item.Logo;
                });
                result.Socials = sociallist;
            }
            //任务
            result.Missions = [];
            if (misslist != null && misslist.length > 0) {
                misslist = await this.ruledMission(misslist, data, onepro.ONTID); //对任务进行判断
                misslist = await this.encryptMissionRef(misslist, data);          //对任务RefInfo进行base64编码
                let piscanget = true;
                misslist.forEach(function (item, i) {
                    if (item.IsCompleted == 0) {
                        piscanget = false;
                        //return false;
                    }
                    result.Missions.push({
                        MissionId: item.MissionId,
                        MissionCode: item.MissionCode,
                        //Pic: imghost + item.Pic,
                        //Status: item.Status,
                        //Condition: item.Condition,
                        RefInfo: item.RefInfo,
                        //Language: item.Language,
                        MissionName: item.MissionName,
                        Description: item.Description,
                        IsCompleted: item.IsCompleted,
                        CompleteDate: item.CompleteDate
                    });
                });

                let decSentTotalAmount = new Decimal(result.SentTotalAmount);
                let decTotalAmount = new Decimal(result.TotalAmount);
                let decDailyMaxAmount = new Decimal(result.DailyMaxAmount);
                //(-2完成但超出总额度，-1完成但超出每天额度，0未完成,2:完成可领取,3:Obtained,4:,5:,6:withdrawing,7:,8:failure,9:completed)
                if (_obtainStatus == 0) {
                    if (piscanget) {
                        //DailyMaxAmount==0：每天的不做限制
                        if (decSentTotalAmount.lt(decTotalAmount) && (_dailyObtainTotalAmount.lt(decDailyMaxAmount) || decDailyMaxAmount.eq(new Decimal(0)))) {
                            _obtainStatus = 2;
                        }
                        else if (decSentTotalAmount.lt(decTotalAmount) && !decDailyMaxAmount.eq(new Decimal(0)) && _dailyObtainTotalAmount.gte(decDailyMaxAmount)) {  //每日超额
                            _obtainStatus = -1;
                        }
                        else if (decSentTotalAmount.gte(decTotalAmount)) {       //超出总金额
                            _obtainStatus = -2;
                        }
                        else {
                            _obtainStatus = 0;
                        }
                    }
                }
            }

            //_projectStatus  //1：no going, 2：obtained；3：expired;  
            //_obtainStatus   //(-2完成但超出总额度，-1完成但超出当天额度，0未完成,2:完成可领取,3:Obtained,4:,5:,6:withdrawing,7:,8:failure,9:completed)
            //整合状态             
            //DispStatus == 1 //按钮可用，黑色，显示 GET [OnceAmount] [TokenName] 例如：GET 200 DLToken
            //DispStatus == 2 //按钮可见不可用，灰色，（完成任务，但【当天】金额领取数已达上限），显示：明天再来/Coming Tomorrow
            //DispStatus == 3 //按钮可见不可用，灰色，（完成任务，但【总】金额领取数已达到上限），显示：活动已结束/The event is over
            //DispStatus == 4 //按钮可见不可用，灰色，（已领取、提现中、已提现），显示：OBTAINED
            //DispStatus == 5 //按钮可见不可用，灰色，（未完成），显示： GET [OnceAmount] [TokenName] 例如：GET 200 DLToken
            //DispStatus == 6 //按钮不可见，（已过期）
            //DispStatus == 0或其它值 //按钮不可见
            if (_projectStatus == 1 && _obtainStatus == 2) {         //按钮可用，显示 GET [OnceAmount] [TokenName] 例如：GET 200 ONT
                result.DispStatus = 1;
            }
            else if (_projectStatus == 1 && _obtainStatus == -1) {   //按钮可见不可用，（完成任务，但【当天】金币领取数已达到上限，不可领），显示：明天再来/Coming Tomorrow；
                result.DispStatus = 2;
            }
            else if (_projectStatus == 1 && _obtainStatus == -2) {   //按钮可见不可用，（完成任务，但【总】金币领取数已达到上限，不可领），显示：活动已结束/The event is over；
                result.DispStatus = 3;
            }
            else if (_projectStatus == 2 || (_projectStatus != 3 && _obtainStatus >= 2)) {  //按钮可见不可用，（已领取、提现中、已提现），显示：OBTAINED；
                result.DispStatus = 4;
            }
            else if (_projectStatus == 1 && _obtainStatus == 0) {    //按钮可见不可用，（未完成），显示： GET [OnceAmount] [TokenName] 例如：GET 200 DLToken
                result.DispStatus = 5;
            }
            else if (_projectStatus == 3) {                          //按钮不可见，（已过期）;
                result.DispStatus = 6;
            }
            else {
                result.DispStatus = 0;
            }

        }
        //this.logger.info('打印出结果：'+JSON.stringify(result));
        return result;
    };

    //获取项目
    async getProject(projectId) {
        return await this.ctx.model.ProjectModel.find({
            where: { ProjectId: projectId },
            attributes: ['ProjectId', 'BlockChainName'],
        });
    };

    //领取糖果
    async getCandy(data) {
        const ctx = this.ctx;

        //判断此ONTID想关联的（ONTID、Address、Phone、Email、Telegram）是否已领取过此项目
        let existsql = 'SELECT cup.ONTID FROM Candy_UserProject cup '
            + ' INNER JOIN Candy_UserProjectTemp tmp ON tmp.ProjectId = :ProjectId AND tmp.ONTID = :ONTID '
            + ' AND (tmp.ONTID = cup.ONTID OR tmp.Address = cup.Address OR tmp.Phone = cup.Phone OR tmp.Email =cup.Email OR tmp.TelegramUserId = cup.TelegramUserId) '
            + ' WHERE cup.ProjectId = :ProjectId; ';
        let existlist = await ctx.model.query(existsql, { raw: true, model: ctx.model.UserProjectModel, replacements: { ONTID: data.ONTID, ProjectId: data.ProjectId } });

        if (existlist != null && existlist.length > 0) {
            return -1; //已领取过，返回-1
        }

        //获取项目详情并判断项目是否存在
        let prosql = '  SELECT ProjectId, OnceAmount, SentTotalAmount, `Status`, ONTID FROM Candy_Project '
            + ' WHERE ProjectId = :ProjectId AND NOT EXISTS(SELECT 1 FROM Candy_UserProject WHERE ProjectId = :ProjectId AND ONTID = :ONTID) ';
        let prolist = await ctx.model.query(prosql, { raw: true, model: ctx.model.ProjectModel, replacements: { ONTID: data.ONTID, ProjectId: data.ProjectId } });

        if (prolist == null || prolist.length == 0) {
            return -1; //不存在，返回-1
        }
        let project = prolist[0];

        //获取此项目的所有任务
        let misssql = ' SELECT m.MissionId, m.MissionCode, pm.`Condition`, upm.Id, '
            + '  CASE WHEN (upm.IsCompleted IS NULL OR upm.IsCompleted = 0) THEN 0 ELSE 1 END IsCompleted, upm.CompleteDate, upm.CreateDate '
            + ' FROM Candy_ProjectMission AS pm '
            + ' INNER JOIN Candy_Mission AS m ON m.MissionId = pm.MissionId AND m.`Status` = 1 '
            + ' LEFT JOIN Candy_UserProjectMission AS upm ON ONTID = :ONTID AND upm.ProjectId = :ProjectId AND upm.MissionId = pm.MissionId '
            + ' WHERE pm.ProjectId = :ProjectId '
        let misslist = await ctx.model.query(misssql, { raw: true, model: ctx.model.MissionModel, replacements: { ONTID: data.ONTID, ProjectId: data.ProjectId } });

        const trans = await ctx.model.transaction();
        try {
            let affectedRows = 0;
            //任务存在，判断任务
            if (misslist != null && misslist.length > 0) {
                misslist = await this.ruledMission(misslist, data, project.ONTID);
                let piscanget = true;
                misslist.forEach(function (item, i) {
                    if (item.IsCompleted == 0) {
                        piscanget = false;
                    }
                });
                if (piscanget == false) {
                    trans.rollback();
                    return -2;  //有任务未完成，返回-2
                }
                let arr = [];
                misslist.forEach(function (item, i) {
                    arr.push({
                        Id: item.Id,
                        ONTID: data.ONTID,
                        ProjectId: data.ProjectId,
                        MissionId: item.MissionId,
                        CreateDate: (item.CreateDate == undefined || item.CreateDate == null || item.CreateDate == 0) ? Math.floor(Date.now() / 1000) : item.CreateDate,
                        CompleteDate: (item.CompleteDate == undefined || item.CompleteDate == null || item.CompleteDate == 0) ? Math.floor(Date.now() / 1000) : item.CompleteDate,
                        IsCompleted: 1,
                    });
                });

                //将已完成的任务更新/插入至UserProjectMission表
                let upmcreate = await ctx.model.UserProjectMissionModel.bulkCreate(arr, { updateOnDuplicate: true, transaction: trans });  //存在则更新
                if (upmcreate != null && upmcreate.length == arr.length) {
                    affectedRows = affectedRows + arr.length;
                }
                else {
                    trans.rollback();
                    return -2; //更新/插入至UserProjectMission表失败，返回-2
                }
            }

            //更新项目已发放金额 、插入UserProject表、插入UserTokenLog            
            let multisql = 'INSERT INTO Candy_UserProject (ProjectId, ONTID, GetDate, TotalAmount, WithdrawAmount, ReceivedAmount, `Status`, IP, Phone, Email, Address,TelegramUserId) '
                + ' SELECT :ProjectId, :ONTID, UNIX_TIMESTAMP(), :TotalAmount, 0, 0, 3, :IP, Phone, Email, Address, TelegramUserId '
                + ' FROM Candy_UserProjectTemp WHERE ProjectId = :ProjectId AND ONTID = :ONTID '
                + ' and NOT EXISTS(SELECT cup.ONTID FROM Candy_UserProject cup '
                + ' INNER JOIN Candy_UserProjectTemp tmp ON tmp.ProjectId = :ProjectId AND tmp.ONTID = :ONTID '
                + ' AND (tmp.ONTID = cup.ONTID OR tmp.Address = cup.Address OR tmp.Phone = cup.Phone OR tmp.Email =cup.Email OR tmp.TelegramUserId = cup.TelegramUserId)'
                + ' WHERE cup.ProjectId = :ProjectId); \n'

                + ' UPDATE Candy_Project SET SentTotalAmount = SentTotalAmount + OnceAmount WHERE ProjectId = :ProjectId AND ROW_COUNT() > 0; \n'
                + ' INSERT INTO Candy_UserTokenLog (ProjectId, ONTID, Action, Amount, CreateDate, `Status`, IP) '
                + " SELECT :ProjectId, :ONTID, 'in', :TotalAmount, UNIX_TIMESTAMP(), 3, :IP FROM DUAL WHERE ROW_COUNT() > 0; ";

            let multirows = await ctx.model.query(multisql, {
                raw: true,
                model: ctx.model.UserTokenLogModel,
                replacements: {
                    ProjectId: data.ProjectId,
                    ONTID: data.ONTID,
                    Address: data.Address,
                    TotalAmount: project.OnceAmount,
                    IP: ctx.ip
                },
                transaction: trans
            });

            let lastaffectedRows = 0;
            if (multirows != null && multirows.length > 0) {
                multirows.forEach(function (item, i) {
                    if (item.affectedRows == undefined || item.affectedRows == 0) {
                        return true;
                    }
                    lastaffectedRows = lastaffectedRows + item.affectedRows;
                });
            }
            if (lastaffectedRows == 0) {
                trans.rollback();
                return -2; //插入UserProject表失败，返回-2
            }

            await trans.commit();
            return affectedRows;
        }
        catch (err) {
            this.logger.error('getCandy失败：' + err);
            trans.rollback();
            return -3;  //获取糖果失败，返回-3
        }

    };

    //判定任务
    async ruledMission(misslist, data, pOntId) {
        for (let i = 0; i < misslist.length; i++) {
            let item = misslist[i];
            let blcomp = item.IsCompleted == 1 ? true : false;

            switch (item.MissionCode) {
                case 'ontcount_op':
                    if (!blcomp) {
                        let amountthreshold = 0, daythreshold = 0;
                        let expr = item.Condition;  //示例：OntBalance > 500&HoldingTime > 5
                        if (expr != null && expr.split('&').length > 1) {
                            let ontCountArg = expr.split('&')[0].trim();
                            let holdTimeArg = expr.split('&')[1].trim();
                            if (ontCountArg.split(' ').length > 2) {
                                amountthreshold = ontCountArg.split(' ')[2];
                            }
                            if (holdTimeArg.split(' ').length > 2) {
                                daythreshold = holdTimeArg.split(' ')[2];
                            }
                        }
                        let holdOntResult = await this.ctx.curl(this.config.mission.holdOnt_queryQualificationUrl, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: {
                                address: data.Address,
                                amountthreshold: amountthreshold,
                                daythreshold: daythreshold,
                            }
                        });
                        if (holdOntResult.status == 200) {
                            let dataJson = JSON.parse(holdOntResult.data);
                            blcomp = dataJson.Result.Qualification;
                        }
                    }
                    break;
                case 'kyc_certification':
                    if (!blcomp) {
                        let kycauthResult = await this.ctx.curl(this.config.mission.kyc_authRecordRestUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: {
                                ThirdPartyOntId: pOntId,
                                UserOntId: data.ONTID,
                            }
                        });
                        if (kycauthResult.status == 200) {
                            let dataJson = JSON.parse(kycauthResult.data);
                            blcomp = dataJson.Result;
                        }
                    }
                    break;
                case 'join_telegram': //根据telegram回调写入数据库
                    //blcomp = item.IsCompleted;
                    break;
            }
            item.IsCompleted = blcomp ? 1 : 0;
        }
        return misslist;
    };

    //编码
    async encryptMissionRef(misslist, data) {
        const telegram_start_url = this.config.telegram.start_url;
        misslist.forEach(function (item, i) {            
            switch (item.MissionCode) {
                case 'ontcount_op':
                    break;
                case 'kyc_certification':
                    break;
                case 'join_telegram': //根据telegram回调写入数据库
                    if (item.RefInfo != undefined && item.RefInfo != null && item.RefInfo != '') {
                        let nonce = Math.ceil(Math.random() * 100);
                        let firstArg = data.ONTID.replace('did:ont:', '');      //去掉did:ont:是为了防止超出64个字符的限制
                        let buffer = new Buffer(firstArg + ' ' + data.ProjectId + ' ' + nonce);
                        let b64param = buffer.toString('base64');               //转base64后去除= 因web.telegram.org浏览器
                        b64param = b64param.replace(new RegExp('=', 'g'), '');  //gm g=global, m=multiLine  【new RegExp('=', 'gm') 和 new RegExp('=', 'g')】
                        item.RefInfo = telegram_start_url + b64param;
                    }
                    break;
            }
        });
        return misslist;
    };


    //完善可信声明
    async improveOntIdClaim(data) {
        const ctx = this.ctx;
        //获取项目详情并判断项目是否存在
        let prosql = ' SELECT ProjectId FROM Candy_Project WHERE ONTID = :ONTID ';
        let prolist = await ctx.model.query(prosql, { raw: true, model: ctx.model.ProjectModel, replacements: { ONTID: data.ProjectOntId } });

        if (prolist == null || prolist.length == 0) {
            return -1; //不存在，返回-1
        }
        let project = prolist[0];
        try {
            //根据（ProjectId, ONTID）插入/更新（Phone, Email）至Candy_UserProjectTemp
            let sql = 'INSERT INTO Candy_UserProjectTemp (ProjectId, ONTID, Phone, Email) SELECT :ProjectId, :ONTID, :Phone, :Email FROM DUAL '
                + ' WHERE NOT EXISTS ( SELECT 1 FROM Candy_UserProjectTemp WHERE ONTID = :ONTID AND ProjectId = :ProjectId ); '

                + ' UPDATE Candy_UserProjectTemp SET Phone = :Phone, Email = :Email WHERE ROW_COUNT() = 0 AND ONTID = :ONTID AND ProjectId = :ProjectId; ';
            let multirows = await ctx.model.query(sql, {
                raw: true,
                model: ctx.model.UserProjectTempModel,
                replacements: {
                    ONTID: data.ONTID,
                    Phone: data.Phone,
                    Email: data.Email,
                    ProjectId: project.ProjectId,
                }
            });
            let affectedRows = 0;
            if (multirows != null && multirows.length > 0) {
                multirows.forEach(function (item, i) {
                    affectedRows = affectedRows + item.affectedRows;
                });
            }
            return affectedRows;
        }
        catch (err) {
            return -2; //完善可信声明失败，返回-2
        }
    };

}

module.exports = ProjectService;