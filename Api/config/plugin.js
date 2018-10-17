'use strict';

// had enabled by egg
// exports.static = true;

// exports.model = {
//     enable: true,
//     package: 'egg-model',
// };
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize'
};
exports.passport = {
  enable: true,
  package: 'egg-passport',
};

//框架安全机制，测试阶段暂时停用
exports.security = {
  enable:false,
  xframe: {
    enable: false,
  },
};

//TODO：待卸载
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};

