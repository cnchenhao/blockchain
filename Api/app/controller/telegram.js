'use strict';

const Controller = require('egg').Controller;
// //633068050:AAFwsK25cLXxLRue0Jv4luaL_c48A2nt25g

// var https=require('https');

class TelegramController extends Controller {
   
    //Webhook回调方法
    async callback() {
        const ctx = this.ctx;
        let data = ctx.request.body;
        let result = await ctx.service.telegramService.callback(data);
        ctx.body = result;
        ctx.stats = 200;
    };

}

module.exports = TelegramController;
