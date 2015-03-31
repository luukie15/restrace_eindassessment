process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var should = require('chai').should();

var passportStub = require('passport-stub');
var app = require('../app');
var request = require('supertest')(app);
var mongoose = require('mongoose');
var Waypoint = mongoose.model('Waypoint');
passportStub.install(app);

describe('Testing waypoints api route', function () {
    describe('searching for cafes', function () { 
        it('should return the results of a text search', function (done) {
            
            var testInfo = {
                cafeName: "de comm"
            };
                   
            request
                .post('/api/waypoints')
                .send(testInfo)
                .expect('Content-Type', /json/)
                .expect(200) //Status code
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('msg');
                    res.body.should.have.property('data');
                    expect(res.body.msg).to.equal('');
                    done();
                });
        });
    });
    describe('getting detail info of cafes', function () { 
        it('should return the details of a cafe', function (done) {
            // reference of cafe de comm (in db)
            var testInfo = {
                reference: 'CnRvAAAAWu8A8homZSAqIgIaosBII5MjZ1T6Azf14qwmJbipAH6PCFsYbk9p4OM5NQqnPK453bWhgZxXnzaCfy552YBmaofVfziMPUp1Wu-ctPtjiuMrTyRW93APY-A8rmdgvgdE3hlG_W1EJ-gRw0VghjOb8xIQCZ3cpytZq29YQ4Yl4OMSFRoUR20iAZN6-KoZpa8NlNsLKK4YHbE'
            };
                   
            request
                .get('/api/waypoints/' + testInfo.reference)
                .send(testInfo)
                .expect('Content-Type', /json/)
                .expect(200) //Status code
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    done();
                });
        });
    });
});