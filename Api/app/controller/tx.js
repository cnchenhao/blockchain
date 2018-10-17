'use strict';

const Controller = require('egg').Controller;
const OntTx = require('../ont/OntService');

class TxController extends Controller {
    async getBalance() {
        OntTx.getBalance();
        this.ctx.body = '';
    }
}

module.exports = TxController;