const Service = require('egg').Service;
const message = require('../../config/message');

class TelegramService extends Service {

    async callback(data) {
        let result = true;
        this.logger.debug(JSON.stringify(data));
        if (data.update_id != null) {
            let msgtext = data.message.text;
            //处理/start命令
            if (msgtext != undefined && msgtext.indexOf('/start', 0) >= 0) {
                result = await this.dealStartParams(msgtext, data.message.from.id);
            }//处理 Join Group动作
            else if (data.message.new_chat_participant != undefined && data.message.new_chat_participant.id != undefined && data.message.new_chat_participant.id != null) {
                result = await this.dealJoinGroup(data.message.chat.id, data.message.chat.username, data.message.from.id, data.message.from.username);
            }
        }
        return result;
    };

    //处理start参数值
    async dealStartParams(text, userid) {
        let result = false;
        let ontId = '';
        let projectId = '';
        try {
            let splitparam = text.split(' ');
            if (splitparam.length <= 1) {  //无参数直接跳出
                this.logger.info('/start 无参数,直接返回');
                return result;
            }
            let startContentb64 = splitparam[1];
            //解码
            var buffer = new Buffer(startContentb64, 'base64')
            let decodeContent = buffer.toString();
            let arrparam = decodeContent.split(' ');
            ontId = 'did:ont:' + arrparam[0];
            projectId = arrparam[1];
        }
        catch (err) {
            this.logger.error('解码失败，详细信息：' + err);
            return result; //解码失败，返回false
        }
        const ctx = this.ctx;
        //获取Join Telegram任务
        let mission = await ctx.model.MissionModel.findOne({ where: { MissionCode: 'join_telegram' }, attributes: ['MissionId', 'MissionCode'] });
        //根据MissionId获取任务配置详情
        let promiss = await ctx.model.ProjectMissionModel.findOne({
            where: { ProjectId: projectId, MissionId: mission.MissionId },
            attributes: ['ProjectId', 'MissionId', 'Condition', 'RefInfo']
        });

        //根据（ProjectId, ONTID）插入/更新（TelegramUserId）至Candy_UserProjectTemp
        let sql = 'INSERT INTO Candy_UserProjectTemp (ProjectId, ONTID, TelegramUserId) SELECT :ProjectId, :ONTID, :TelegramUserId FROM DUAL '
            + ' WHERE NOT EXISTS ( SELECT 1 FROM Candy_UserProjectTemp WHERE ONTID = :ONTID AND ProjectId = :ProjectId ); '

            + ' UPDATE Candy_UserProjectTemp SET TelegramUserId = :TelegramUserId WHERE ROW_COUNT() = 0 AND ONTID = :ONTID AND ProjectId= :ProjectId; ';
        let multirows = await ctx.model.query(sql, {
            raw: true,
            model: ctx.model.UserProjectTempModel,
            replacements: {
                ONTID: ontId,
                TelegramUserId: userid,
                ProjectId: projectId,
            }
        });

        //将Telegram UserId写入UserProjectMission表
        let upmCreate = await ctx.model.UserProjectMissionModel.findOrCreate({
            where: { ONTID: ontId, ProjectId: projectId, MissionId: mission.MissionId },
            defaults: {
                ONTID: ontId,
                ProjectId: projectId,
                MissionId: mission.MissionId,
                RefId: userid,
                RefInfo: promiss.RefInfo,
                CreateDate: Math.floor(Date.now() / 1000),
                IsCompleted: 0,
            }
        });

        //bot发送群链接私聊信息
        if (upmCreate[0].Id > 0) {
            //let url = 'https://api.telegram.org/bot633068050:AAFwsK25cLXxLRue0Jv4luaL_c48A2nt25g/sendMessage';
            let url = this.config.telegram.sendMessage_url;
            let params = this.config.telegram.sendMessage_params;
            let sendresult = await ctx.curl(url, {
                type: 'POST',
                data: { chat_id: userid, text: promiss.RefInfo }
            });
            if (sendresult.status == 200) {
                result = true;
            }
        }
        return result;
    };

    //处理加入Group
    async dealJoinGroup(chatid, chatname, userid, username) {
        let result = false;
        const ctx = this.ctx;
        let host_url = this.config.telegram.host_url;
        //获取Join Telegram任务
        let mission = await ctx.model.MissionModel.findOne({ where: { MissionCode: 'join_telegram' }, attributes: ['MissionId', 'MissionCode'] });
        //根据MissionId获取用户是否已执行/Start命令
        let upmUpdate = await ctx.model.UserProjectMissionModel.update(
            { CompleteDate: Math.floor(Date.now() / 1000), IsCompleted: 1, },
            {
                where: { RefId: userid, MissionId: mission.MissionId, RefInfo: host_url + chatname },
                fields: ['CompleteDate', 'IsCompleted']
            });
        //bot在Group内发送已加群成功消息
        if (upmUpdate[0] > 0) {
            let msg = message.returnObj('en');
            let url = this.config.telegram.sendMessage_url;
            let params = this.config.telegram.sendMessage_params;
            let sendresult = await ctx.curl(url, {
                type: 'POST',
                data: { chat_id: chatid, text: '@' + username + ' ' + msg.telegramJoinedGroupBotAutoReply.message }
            });
            if (sendresult.status == 200) {
                result = true;
            }
        }
        return result;
    };

}

module.exports = TelegramService;