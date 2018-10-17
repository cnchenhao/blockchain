// 错误码统一编码，提示信息多语言
module.exports = {

  success: 0,
  notFoundPublicKey: 200099001,
  verifySignatrueError: 200099002,
  serverError: 200099003,
  timestampError: 200099004,
  parameterError: 200099005,

  projectNotExistOrHasGot: 200099006,
  projectNotCompleted: 200099007,
  projectGetCandyError: 200099008,

  incomeProjectNotExistOrHasGot: 200099009,
  incomeWithdrawError: 200099010,
  incomeAddressError: 200099011,

  telegramJoinedGroupBotAutoReply: 200099012,


  returnObj(lang) {

    en = {
      lang: 'en',
      success: { code: this.success, message: 'success' },
      notFoundPublicKey: { code: this.notFoundPublicKey, message: 'Has no public key' },
      verifySignatrueError: { code: this.verifySignatrueError, message: 'Verify signatrue error' },
      serverError: { code: this.serverError, message: 'The server is busy, try again later' },
      timestampError: { code: this.timestampError, message: 'The timestamp is timeout' },
      parameterError: { code: this.parameterError, message: 'The parameter is error' },

      projectNotExistOrHasGot: { code: this.projectNotExistOrHasGot, message: 'The project is not exist or has been got' },
      projectNotCompleted: { code: this.projectNotCompleted, message: 'Has missions not completed' },
      projectGetCandyError: { code: this.projectGetCandyError, message: 'get candy error,try again later' },

      incomeProjectNotExistOrHasGot: { code: this.incomeProjectNotExistOrHasGot, message: 'The project is not exist or has been got' },
      incomeWithdrawError: { code: this.incomeWithdrawError, message: 'withdraw error,try again later' },
      incomeAddressError: { code: this.incomeAddressError, message: 'The address format is error' },

      telegramJoinedGroupBotAutoReply: { code: this.telegramJoinedGroupBotAutoReply, message: 'The mission has completed,please return to Candybox get the candy' },
    };

    zh = {
      lang: 'zh',
      success: { code: this.success, message: '成功' },
      notFoundPublicKey: { code: this.notFoundPublicKey, message: '查询不到公钥' },
      verifySignatrueError: { code: this.verifySignatrueError, message: '签名验证错误' },
      serverError: { code: this.serverError, message: '服务器忙，稍后再试' },
      timestampError: { code: this.timestampError, message: '时间戳超时' },
      parameterError: { code: this.parameterError, message: '参数错误' },

      projectNotExistOrHasGot: { code: this.projectNotExistOrHasGot, message: '项目不存在，或者你已获取' },
      projectNotCompleted: { code: this.projectNotCompleted, message: '有任务未完成' },
      projectGetCandyError: { code: this.projectGetCandyError, message: '获取失败，请稍后重试' },

      incomeProjectNotExistOrHasGot: { code: this.incomeProjectNotExistOrHasGot, message: '项目不存在，或者你已提取' },
      incomeWithdrawError: { code: this.incomeWithdrawError, message: '提取失败，请稍后重试' },
      incomeAddressError: { code: this.incomeAddressError, message: '地址格式错误' },

      telegramJoinedGroupBotAutoReply: { code: this.telegramJoinedGroupBotAutoReply, message: '任务已完成，请返回CandyBox领取糖果' },
    };

    let message;

    switch (lang) {
      case 'en':
        message = en;
        break;
      case 'zh':
      case 'zh-Hans':
        message = zh;
        break;
      default:
        message = en;
        break;
    }

    return message;
  },

};
