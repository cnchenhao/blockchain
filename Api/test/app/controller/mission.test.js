const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/mission.test.js', () => {

    it('should status 200 ruledMission', () => {
        return app.httpRequest()
            .post('/mission/ruledMission')
            .type('json')
            .send({
                ontCount: 15,
                kycCertified:true,
            })
            .expect(200);
    });


});