const Service = require('egg').Service;

class UserService extends Service {

  async login(ontId, publicKey, deviceCode) {
    const ip = this.ctx.ip;
    const sql = 'START TRANSACTION; '
      + 'INSERT INTO `User` (`ONTID`,`PublicKey`,`CreateDate`) SELECT :ONTID, :PublicKey, UNIX_TIMESTAMP() FROM DUAL WHERE NOT EXISTS (SELECT `ONTID` FROM `User` WHERE `ONTID`=:ONTID); '
      + 'UPDATE `User` SET `DeviceCode`=:DeviceCode, `LastLoginDate`=UNIX_TIMESTAMP(), `LastLoginIP`=:IP WHERE `ONTID`=:ONTID; '
      + 'INSERT INTO UserLoginLog (`ONTID`, `DeviceCode`, `IP`, `LoginDate`) VALUES(:ONTID, :DeviceCode, :IP, UNIX_TIMESTAMP()); '
      + 'COMMIT ';
    try {
      // let i = ctx.model.UserModel.findOrCreate( {where: {ONTID: ontId}, defaults:user} );
      await this.ctx.model.query(sql, { raw: true, replacements: { ONTID: ontId, PublicKey: publicKey, DeviceCode: deviceCode, IP: ip } });
      return 0;
    } catch (err) {
      this.logger.error(err);
      return -2;
    }
  }

  async getUserInfo(ontId) {

  };

}
module.exports = UserService;
