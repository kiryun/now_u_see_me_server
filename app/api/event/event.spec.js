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
    
    //event/upload
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

    //event/token
    it('POST /event/token', (done) => {
        request(app)
        .post('/event/token')
        .send({
            token: 'fakeToken',
            
        })
        .expect(201)
        .end((err, res) => {
            if(err){
                throw err;
            }
            done();
        });
    });

    //event/unknown
    it('POST /event/unknown', (done) => {
        request(app)
        .post('/event/unknown')
        .send({
            eventTime: '2019-07-09-10-010-01',
            types: '0',
            img_addrs: '../learn/fr/2019-07-09-10-010-01.jpg'
        })
        .expect(201)
        .end((err, res) => {
            if(err){
                throw err;
            }
            done();
        });
    });

    //event/images
    it('GET /event:eventTime', (done) => {
        request(app)
            .get('/event/images/2019-07-09-10-010-01')
            .expect(200)
            .end((err, res) => {
                if (err){
                    throw err;
                }

                // console.log("read\n");
                done();
            });
    });

    //event/update
    it('POST /event/update', (done) => {
        request(app)
        .post('/event/update')
        .send({
            eventTime: '2019-07-09-10-010-01',
            types: 'Family',
            img_addrs: '../learn/un/2019-07-09-10-010-01.jpg'
        })
        .expect(201)
        .end((err, res) => {
            if(err){
                throw err;
            }
            done();
        });
    });

})