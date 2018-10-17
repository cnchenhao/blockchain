'use strict';

const Controller = require('egg').Controller;

class ProjectController extends Controller {
    //获取项目列表
    async getProjectList() {
        const ctx = this.ctx;
        //let lang = ctx.request.header.lang == undefined || ctx.request.header.lang == 'zh' ? 'zh-Hans' : ctx.request.header.lang;//IOS提交的是zh-Hans；安卓提交的是zh

        let lang = ctx.ont.user.lang;
        let ontId = ctx.ont.user.ontId;

        let page = ctx.query.page == undefined ? 1 : parseInt(ctx.query.page);
        let pageSize = ctx.query.pageSize == undefined ? 10 : parseInt(ctx.query.pageSize);
        let offset = (page < 1 ? 0 : page - 1) * pageSize;
        let limit = pageSize;

        var result = await ctx.service.projectService.getProjectList(lang, ontId, offset, limit);
        //ctx.body = { code: 0, message: 'success', data: result };
        ctx.body = ctx.ont.msg.success;
        ctx.body.data = result;
        ctx.stats = 200;

    };

    //获取项目详情
    async getProjectDetail() {
        const ctx = this.ctx;
        let lang = ctx.ont.user.lang;
        let ontId = ctx.ont.user.ontId;

        if (ctx.request.body.projectId == undefined || ctx.request.body.projectId == null || ctx.request.body.projectId == '' || ctx.request.body.projectId == 0 || ctx.request.body.projectId == '0') {
            ctx.body = ctx.ont.msg.parameterError;
            ctx.body.data = 0;
            ctx.stats = 200;
            return;
        }

        let data = {
            Lang: lang,
            ONTID: ontId,
            // ONTCount: (ctx.request.body.ontCount == undefined || ctx.request.body.ontCount == '') ? 0 : ctx.request.body.ontCount,
            // KYCCertified: (ctx.request.body.kycCertified == undefined || ctx.request.body.kycCertified == '') ? 0 : ctx.request.body.kycCertified,
            ProjectId: ctx.request.body.projectId,
            Address: ctx.request.body.address == undefined ? '' : ctx.request.body.address,
        };

        let result = await ctx.service.projectService.getProjectDetail(data);
        //ctx.body = { code: 0, message: 'success', data: result };
        ctx.body = ctx.ont.msg.success;
        ctx.body.data = result;
        ctx.stats = 200;

    };

    //获取奖励
    async getCandy() {
        const ctx = this.ctx;
        let lang = ctx.ont.user.lang;
        let ontId = ctx.ont.user.ontId;

        if (ctx.request.body.projectId == undefined || ctx.request.body.projectId == null || ctx.request.body.projectId == '' || ctx.request.body.projectId == 0 || ctx.request.body.projectId == '0'
            || ctx.request.body.address == undefined || ctx.request.body.address == null || ctx.request.body.address == '') {
            ctx.body = ctx.ont.msg.parameterError;
            ctx.body.data = 0;
            ctx.stats = 200;
            return;
        }

        let data = {
            ONTID: ontId,
            // ONTCount: (ctx.request.body.ontCount == undefined || ctx.request.body.ontCount == '') ? 0 : ctx.request.body.ontCount,
            // KYCCertified: (ctx.request.body.kycCertified == undefined || ctx.request.body.kycCertified == '') ? 0 : ctx.request.body.kycCertified,
            ProjectId: ctx.request.body.projectId,
            Address: ctx.request.body.address,
        };

        let result = await ctx.service.projectService.getCandy(data);
        switch (result) {
            case -1: //not exists or has got
                ctx.body = ctx.ont.msg.projectNotExistOrHasGot;
                break;
            case -2: //missions not completed
                ctx.body = ctx.ont.msg.projectNotCompleted;
                break;
            case -3: //error
                ctx.body = ctx.ont.msg.projectGetCandyError;
                break;
            default:
                ctx.body = ctx.ont.msg.success;
                break;
        }
        ctx.body.data = result;
        ctx.stats = 200;
    };


    //improveUserInfo
    //完善可信声明
    async improveOntIdClaim() {
        const ctx = this.ctx;

        if (ctx.request.body.OntPassOntId == undefined || ctx.request.body.OntPassOntId == null || ctx.request.body.OntPassOntId == ''
            || ctx.request.body.UserOntId == undefined || ctx.request.body.UserOntId == null || ctx.request.body.UserOntId == ''
            || ctx.request.body.EncryClaims == undefined || ctx.request.body.EncryClaims == null || ctx.request.body.EncryClaims.length == 0
            || ctx.request.body.ThirdPartyOntId == undefined || ctx.request.body.ThirdPartyOntId == null || ctx.request.body.ThirdPartyOntId == '') {
            ctx.body = { code: 200099005, message: 'The parameter is error', data: 0 };
            ctx.stats = 200;
            return;
        }

        let email = '', phone = '';
        ctx.request.body.EncryClaims.forEach(function (one, i) {
            let splitparam = one.split('.');
            if (splitparam.length <= 0) {
                //return false;//break;
                return true;//continue;
            }
            splitparam.forEach(function (item, i) {
                try {
                    //解码
                    var buffer = new Buffer(item, 'base64')
                    let decodeContent = buffer.toString();
                    let decjson = JSON.parse(decodeContent);
                    if (decjson.clm != undefined) {
                        if (decjson.clm.Email != undefined && decjson.clm.Email != null && decjson.clm.Email != '') {
                            email = decjson.clm.Email;
                        }
                        if (decjson.clm.PhoneNumber != undefined && decjson.clm.PhoneNumber != null && decjson.clm.PhoneNumber != '') {
                            phone = decjson.clm.PhoneNumber;
                        }
                    }
                }
                catch (err) {

                }
            });
        });
        if (email == '' || phone == '') {
            ctx.body = { code: 200099005, message: 'The parameter is error', data: 0 };
            ctx.stats = 200;
            return;
        }
        let data = {
            ONTID: ctx.request.body.UserOntId,
            Phone: phone,
            Email: email,
            ProjectOntId: ctx.request.body.ThirdPartyOntId,
        };
        let result = await ctx.service.projectService.improveOntIdClaim(data);

        if (result < 0) {
            switch (result) {
                case -1: //The project is not exist
                    ctx.body = { code: 200099009, message: 'The project is not exist', data: result };
                    break;
                case -2: //error
                    ctx.body = { code: 200099003, message: 'The server is busy, try again later', data: result };
                    break;
                case 0: //success
                    ctx.body = { code: 0, message: 'success', data: result };
                    break;
                default:
                    ctx.body = { code: 200099003, message: 'The server is busy, try again later', data: result };
                    break;
            }
            //ctx.body = { code: 200099003, message: 'The server is busy, try again later', data: result };
            ctx.stats = 200;
        }
        else {
            ctx.body = { code: 0, message: 'success', data: result };
        }
        ctx.stats = 200;
    };

}

module.exports = ProjectController;
