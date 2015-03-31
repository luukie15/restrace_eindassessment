process.env.NODE_ENV = 'test';

//var request = require('supertest');
//var expect = require('chai').expect;
//var should = require('chai').should();
//var passportStub = require('passport-stub');
//var User = require('mongoose').model('User');
//
//var app = require('express')();
//var index = require('../routes/index');
//app.use('/', index);
//
//passportStub.install(app);
//
//function makeRequest(route, statusCode, done) {
//    request(app)
//            .get(route)
//            .expect(statusCode)
//            .end(function (err, res) {
//                if (err) {
//                    return done(err);
//                }
//
//                done(null, res);
//            });
//}
//;
//
//describe('Test for users routing', function () {
//    describe('Get /profile', function () {
//        it('should return 200 when logged in', function (done) {
//            passportStub.login(new User());
//            request(app)
//                .get('/profile')
//                .expect(200)
//                .end(function (err, res) {
//                    if (err) {
//                        return done(err);
//                    }
//
//                    // Iets verwachten
//
//                    done();
//                });
//        });
//    });
//});