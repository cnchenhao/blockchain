'use strict';
const { Controller } = require('egg');
const jwt = require('jsonwebtoken');

class BaseController extends Controller {
  resp(code, data, httpStatus) {
    if (httpStatus == undefined || httpStatus == 200) {
      this.ctx.body = {
        code,
        message: '', // todo 根据code获取message
        data,
      };
    } else {
      this.ctx.status = httpStatus;
      this.ctx.body = data;
    }
  }

}

module.exports = BaseController;
