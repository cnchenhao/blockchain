'use strict';

const Controller = require('egg').Controller;
const Web3Service = require('../eth/Web3Service');
const OntService = require('../ont/OntService');
const consts = require('../extend/consts');

class IncomeController extends Controller {
    //获取收入首页展示摘要信息
    async getIncomeBrief() {
        const ctx = this.ctx;
        let ontId = ctx.ont.user.ontId;

        let result = await ctx.service.incomeService.getIncomeBrief(ontId);
        //ctx.body = { code: 0, message: 'success', data: result };
        ctx.body = ctx.ont.msg.success;
        ctx.body.data = result;
        ctx.stats = 200;
    };

    //获取收入列表
    async getIncomeList() {
        const ctx = this.ctx;
        let ontId = ctx.ont.user.ontId;

        let page = ctx.query.page == undefined ? 1 : parseInt(ctx.query.page);
        let pageSize = ctx.query.pageSize == undefined ? 10 : parseInt(ctx.query.pageSize);
        let offset = (page < 1 ? 0 : page - 1) * pageSize;
        let limit = pageSize;

        let result = await ctx.service.incomeService.getIncomeList(ontId, offset, limit);
        //ctx.body = { code: 0, message: 'success', data: result };
        ctx.body = ctx.ont.msg.success;
        ctx.body.data = result;
        ctx.stats = 200;
    };

    //获取记录列表
    async getRecordList() {
        const ctx = this.ctx;
        let ontId = ctx.ont.user.ontId;

        let page = ctx.query.page == undefined ? 1 : parseInt(ctx.query.page);
        let pageSize = ctx.query.pageSize == undefined ? 10 : parseInt(ctx.query.pageSize);
        let offset = (page < 1 ? 0 : page - 1) * pageSize;
        let limit = pageSize;

        let result = await ctx.service.incomeService.getRecordList(ontId, offset, limit);
        //ctx.body = { code: 0, message: 'success', data: result };
        ctx.body = ctx.ont.msg.success;
        ctx.body.data = result;
        ctx.stats = 200;
    };

    //获取地址列表
    async getAddressList() {
        const ctx = this.ctx;
        let ontId = ctx.ont.user.ontId;

        let page = ctx.query.page == undefined ? 1 : parseInt(ctx.query.page);
        let pageSize = ctx.query.pageSize == undefined ? 10 : parseInt(ctx.query.pageSize);
        let offset = (page < 1 ? 0 : page - 1) * pageSize;
        let limit = pageSize;

        let result = await ctx.service.incomeService.getAddressList(ontId, offset, limit);
        //ctx.body = { code: 0, message: 'success', data: result };
        ctx.body = ctx.ont.msg.success;
        ctx.body.data = result;
        ctx.stats = 200;
    };

    //提币时获取地址列表
    async getWithdrawAddressList() {
        const ctx = this.ctx;
        let ontId = ctx.ont.user.ontId;

        if (ctx.query.projectId == undefined || ctx.query.projectId == null || ctx.query.projectId == '' || ctx.query.projectId == 0) {
            ctx.body = ctx.ont.msg.parameterError;
            ctx.body.data = 0;
            ctx.stats = 200;
            return;
        }

        let page = ctx.query.page == undefined ? 1 : parseInt(ctx.query.page);
        let pageSize = ctx.query.pageSize == undefined ? 10 : parseInt(ctx.query.pageSize);
        let offset = (page < 1 ? 0 : page - 1) * pageSize;
        let limit = pageSize;
        let projectId = ctx.query.projectId;

        let result = await ctx.service.incomeService.getWithdrawAddressList(ontId, projectId, offset, limit);
        //ctx.body = { code: 0, message: 'success', data: result };
        ctx.body = ctx.ont.msg.success;
        ctx.body.data = result;
        ctx.stats = 200;
    }

    //提币时判断地址格式是否正确
    async isAddress() {
        const ctx = this.ctx;
        let isAddr = false;
        let project = await this.service.projectService.getProject(ctx.request.body.projectId);
        if (project.BlockChainName == consts.blockChain.eth) {
            isAddr = Web3Service.isAddress(ctx.request.body.address);
        }

        if (project.BlockChainName == consts.blockChain.ont || project.BlockChainName == consts.blockChain.neo) {
            isAddr = OntService.isAddress(ctx.request.body.address);
        }

        //错误的地址格式
        if (!isAddr) {
            ctx.body = ctx.ont.msg.incomeAddressError;
            return;
        }

        ctx.body = ctx.ont.msg.success;
    }

    //提币请求
    async saveWithdraw() {
        const ctx = this.ctx;
        let ontId = ctx.ont.user.ontId;

        if (ctx.request.body.address == undefined || ctx.request.body.address == null || ctx.request.body.address == ''
            || ctx.request.body.projectId == undefined || ctx.request.body.projectId == null || ctx.request.body.projectId == '' || ctx.request.body.projectId == 0) {
            ctx.body = ctx.ont.msg.parameterError;
            ctx.body.data = 0;
            ctx.stats = 200;
            return;
        }

        //检查是否是正确的地址
        let isAddr = false;
        let project = await this.service.projectService.getProject(ctx.request.body.projectId);
        if (project.BlockChainName == consts.blockChain.eth) {
            isAddr = Web3Service.isAddress(ctx.request.body.address);
        }

        if (project.BlockChainName == consts.blockChain.ont || project.BlockChainName == consts.blockChain.neo) {
            isAddr = OntService.isAddress(ctx.request.body.address);
        }

        //错误的地址格式
        if (!isAddr) {
            ctx.body = ctx.ont.msg.incomeAddressError;
            return;
        }

        let data = {
            ProjectId: ctx.request.body.projectId,
            ONTID: ontId,
            Address: ctx.request.body.address,
        };
        let result = await ctx.service.incomeService.saveWithdraw(data);
        switch (result) {
            case -1:  //not exists or has got
                ctx.body = ctx.ont.msg.incomeProjectNotExistOrHasGot;
                break;
            case -2: //error
                ctx.body = ctx.ont.msg.incomeWithdrawError;
                break;
            default:
                ctx.body = ctx.ont.msg.success;
                break;
        }
        ctx.body.data = result;
        ctx.stats = 200;
    };
}

module.exports = IncomeController;
