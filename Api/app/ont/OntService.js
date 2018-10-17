'use strict';
const OntologySdk = require('ontology-ts-sdk');
const config = require('../../config/config.default')('');
const restUrl = config.ont.isMain ? config.ont.mainRestUrl : config.ont.testRestUrl;

module.exports = {

    isAddress(address) {
        if (/A[0-9a-zA-Z]{33}$/.test(address)) {
            return true;
        }
        return false;
    },
    
    //转账
    async transfer() {
        config.ont.adminAddress;
        config.ont.adminPrivateKey;

        const restClient = new OntologySdk.RestClient(config.ont.RestUrl);

    },

    //查询余额
    async getBalance() {
        const to = new OntologySdk.Crypto.Address('AdLUBSSHUuFaak9j169hiamXUmPuCTnaRz');
        const restClient = new OntologySdk.RestClient(restUrl);
        const result = await restClient.getBalance(to);
        console.log(result);
    }

    //查询智能合约

    //执行智能合约

}