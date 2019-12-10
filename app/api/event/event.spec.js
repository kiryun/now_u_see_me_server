const request = require('supertest');
const app = require('../../app');
const models = require('../../models/models');
const fs = require('fs');

//event
describe('Event Test Driven Development', () => {
    const syncDatabase = require('../../../bin/sync-database');
    before('Sync test database', () =>{
        //sync database ...

        syncDatabase().then(() => {
            console.log('Test database sync');
        });
    });
    
    //event upload
    it('POST /event/upload', (done) => {
        request(app)
        .post('/event/upload')
        .field('Content-Type', 'multipart/form-data')
        .field('originalname', '2019-07-09-10-010-01.jpg')
        .attach(
            'files',
            '/Users/gihyunkim/Documents/Univ/now_u_see_me/now_u_see_me_ubuntu/now_u_see_me_server/app/api/event/test_imgs/2019-07-09-10-010-01.jpg'
        )
        .expect(200)
        .end((err, res) => {
            if(err){
                throw err;
            }
            done();
        });
    });



})