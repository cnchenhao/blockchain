'use strict';
const Controller = require('./base_controller');
const OntPassport = require('../ont/passport');
const message = require('../../config/message');

class UserController extends Controller {
  async login() {
    const ctx = this.ctx;
    let { timestamp, ontId, nonce, deviceCode, sig } = ctx.request.body;
    let lang = ctx.headers.lang;
    let retObj = await OntPassport.verify(timestamp, ontId, nonce, deviceCode, sig, lang);

    let msg = message.returnObj(lang);

    if (retObj.code == 0) {
      //保存到数据库
      let result = await this.service.userService.login(ontId, '', deviceCode);
      if (result != 0) {
        ctx.body = msg.serverError;
        return;
      }
    }

    ctx.body = retObj;
  }

  async getUserInfo() {
    this.service.userService.getUserInfo(this.ctx.ont.user);
    this.ctx.body = this.ctx.ont.user;
  };
}

module.exports = UserController;
