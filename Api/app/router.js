'use strict';
const OntPassport = require('./ont/passport');
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.opts.sensitive = false;
  router.get('/', controller.home.index);
  // router.get('/login/getToken', controller.login.getAccessToken);
  // router.get('/login/refreshToken', controller.login.refreshToken);

  //test
  //router.get("/tx/getBalance", controller.tx.getBalance);

  router.post('/user/login', controller.user.login);
  //test
  router.get('/user/getUserInfo', OntPassport.authorize, controller.user.getUserInfo);

  router.get('/project/getProjectList', OntPassport.authorize, controller.project.getProjectList);
  router.post('/project/getProjectDetail', OntPassport.authorize, controller.project.getProjectDetail);
  router.post('/project/getCandy', OntPassport.authorize, controller.project.getCandy);
  router.post('/project/improveOntIdClaim', controller.project.improveOntIdClaim);  

  router.get('/income/getIncomeBrief', OntPassport.authorize, controller.income.getIncomeBrief);
  router.get('/income/getIncomeList', OntPassport.authorize, controller.income.getIncomeList);
  router.get('/income/getRecordList', OntPassport.authorize, controller.income.getRecordList);
  router.get('/income/getAddressList', OntPassport.authorize, controller.income.getAddressList);
  router.get('/income/getWithdrawAddressList', OntPassport.authorize, controller.income.getWithdrawAddressList);
  router.post('/income/saveWithdraw', OntPassport.authorize, controller.income.saveWithdraw);
  router.post('/income/isAddress', OntPassport.authorize, controller.income.isAddress);

  router.post('/telegram/callback', controller.telegram.callback);
  router.get('/telegram/callback', controller.telegram.callback);

};
