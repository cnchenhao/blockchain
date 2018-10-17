'use strict';
const jwt = require('jsonwebtoken');
const OntologySdk = require('ontology-ts-sdk');
const config = require('../../config/config.default')('');
const message = require('../../config/message');

module.exports = {
    // 客户端登录
    async verify(timestamp, ontId, nonce, deviceCode, sig, lang) {
        //获取该语言message
        let msg = message.returnObj(lang);

        // 判断时间戳是否超时，超过3600秒为超时
        // let now = Math.floor(Date.now() / 1000);
        // if (Math.abs(now - timestamp) > 3600) {
        //     return msg.timestampError;
        // }

        // 验证签名信息
        if (!await this.verifySignature(deviceCode, ontId, nonce, timestamp, sig)) {
            return msg.verifySignatrueError;
        }

        // 要生成token的主题信息
        let content = { ONTID: ontId };
        // 过期时间
        const expires = config.login.expires;
        // 生成token
        let token = jwt.sign(content, config.login.secretKey, {
            expiresIn: expires,
        });

        // 返回
        let retObj = msg.success;
        retObj.data = {
            access_token: token,
            expires_in: Math.floor(Date.now() / 1000) + expires,
            token_type: 'Bearer',
        };

        return retObj;
    },

    // 验证签名
    async verifySignature(deviceCode, ontId, nonce, timestamp, sig) {
        // 从链上获取ontId的公钥
        // 构造tx
        const tx = OntologySdk.OntidContract.buildGetDDOTx(ontId);
        let restClient;
        let response;

        // 发起交易，先查主网，再查测试网
        restClient = new OntologySdk.RestClient(config.ont.mainRestUrl);
        response = await restClient.sendRawTransaction(tx.serialize(), true);
        if (response.Result.Result == '') {
            restClient = new OntologySdk.RestClient(config.ont.testRestUrl);
            response = await restClient.sendRawTransaction(tx.serialize(), true);
        }

        // ONTID错误或没有上链，无法查询到公钥
        if (response.Result.Result == '') {
            return false;
        }

        const ddo = OntologySdk.DDO.deserialize(response.Result.Result);
        const publicKey = ddo.publicKeys[0].pk.key;

        const hexSig = new Buffer(sig, 'base64').toString('hex');

        // 初始化签名对象
        const signature = OntologySdk.Crypto.Signature.deserializeHex(hexSig);
        // 初始化加密算法
        const crypto = new OntologySdk.Crypto.PublicKey(publicKey, OntologySdk.Crypto.KeyType.ECDSA, new OntologySdk.Crypto.KeyParameters(OntologySdk.Crypto.CurveLabel.SECP256R1));

        // 拼原始内容
        const msg = 'deviceCode=' + deviceCode + '&nonce=' + nonce + '&ontId=' + ontId + '&timestamp=' + timestamp;
        const hexMsg = OntologySdk.utils.str2hexstr(msg);

        // 验证签名
        const isVerify = crypto.verify(hexMsg, signature);

        return isVerify;
    },

    // 验证jwt
    async authorize(ctx, next) {
        // 获取headers信息
        const { lang, os, ontid, version, authorization } = ctx.headers; //this.ctx.request.header

        // 验证token
        // 没有authorization token信息
        if (ctx.headers.authorization == undefined) {
            ctx.throw(401, 'Access denied.');
        }

        // 解析request headers
        const auths = authorization.split(' ');

        // 认证协议错误
        if (auths[0] != 'Bearer' || auths.length != 2) {
            ctx.throw(401, 'The authorization is error.');
        }

        const token = auths[1];
        let user;

        try {
            user = jwt.verify(token, config.login.secretKey);
        } catch (err) {
            // jwt expired
            console.log(err);
            ctx.throw(401, 'The token is error.');
        }

        // 客户端切换过ONTID，需要重新登录
        if (user.ONTID != ontid) {
            // ctx.response.status(401).send("The token has expired.");
            ctx.throw(401, 'The ontid is error.');
        }

        ctx.ont = {};
        ctx.ont.user = {
            ontId: ontid,
            lang: lang == 'zh' ? 'zh-Hans' : lang, // iOS提交的是zh-Hans；安卓提交的是zh
            os,
            version,
        };

        ctx.ont.isAuthenticated = function () { return !!(user); };

        // 错误码统一编码
        ctx.ont.msg = message.returnObj(lang);

        console.log(user);
        await next();
    },

};
