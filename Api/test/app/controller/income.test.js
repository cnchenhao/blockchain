// const { app, mock, assert } = require('egg-mock/bootstrap');

// describe('test/app/controller/income.test.js', () => {

//     // it('should status 200 getIncomeBrief', () => {
                
//     //     app.mockHeaders({
//     //         Lang:0,
//     //         Os:0,
//     //         Version:'1.0.1',
//     //         Authorization:'Bearer 123456789',
//     //         OntId:'123',
//     //     });
        
//     //     return app.httpRequest()
//     //       .get('/income/getIncomeBrief')
             
//     //       //.expect('hi, egg')
//     //       .expect(200);
//     //   });

//     it('should status 200 saveWithdraw', () => {
//         return app.httpRequest()
//             .post('/income/saveWithdraw')
//             .type('json')
//             .send({
//                 joinId: 1,
//                 projectId: 1,
//                 amount: 3.002,
//                 address: '123eeedddfff',
//             })
//             .expect(200);
//     });


// });