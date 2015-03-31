process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var should = require('chai').should();

var passportStub = require('passport-stub');
var app = require('../app');
var request = require('supertest')(app);
var mongoose = require('mongoose');
var Race = mongoose.model('Race');
var User = mongoose.model('User');
passportStub.install(app);

describe('Testing race api route', function () {
    var id = "";
    var reference = "";
    describe('adding race', function () {
        it('should adds a new race', function (done) {
            var testInfo = {
                name: 'testrace'
            };
            request
                .post('/api/races')
                .send(testInfo)
                .expect('Content-Type', /json/)
                .expect(200) //Status code
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // Should.js fluent syntax applied
                    res.body.should.have.property('msg');
                    done();
                });
        });
    });
    describe('updating race', function () {
        it('should return an added race', function (done) {
            var testRace = new Race({name: 'testRace'});
            testRace.save();
            
            var testInfo = {
               name: 'testrace2'
            };
            request
                .put('/api/races/' + testRace._id)
                .send(testInfo)
                .expect('Content-Type', /json/)
                .expect(200) //Status code
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    id = testRace._id;
                    // Should.js fluent syntax applied
                    res.body.should.have.property('msg');
                    done();
                });
        });
    });
    describe('change status of race', function () {
        it('should set status of a race on started', function (done) {
            var testInfo = {
                status: 'started'
            };
            request
                .post('/api/races/' + id)
                .send(testInfo)
                .expect('Content-Type', /json/)
                .expect(200) //Status code
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.body).to.have.property('msg');
                    expect(res.body).to.have.property('status');
                    expect(res.body.status).to.not.be.undefined;
                    expect(res.body.status).to.equal('started');
                    done();
                });
        });
        it('should set status of a race on stopped', function (done) {
            var testInfo = {
                status: 'stopped'
            };
            request
                .post('/api/races/' + id)
                .send(testInfo)
                .expect('Content-Type', /json/)
                .expect(200) //Status code
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    expect(res.body).to.have.property('msg');
                    expect(res.body).to.have.property('status');
                    expect(res.body.status).to.not.be.undefined;
                    expect(res.body.status).to.equal('stopped');
                    done();
                });
        });
        it('should return an error (500) because the input isn\'t started or stopped', function (done) {
            var testInfo = {
                status: 'test'
            };
            request
                .post('/api/races/' + id)
                .send(testInfo)
                .expect('Content-Type', /json/)
                .expect(500) //Status code
                .end(done);
        });
    });
    describe('adding waypoint to race', function () {
        it('should add a waypoint to a race', function (done) {
            var testInfo = {
                id: '6c3642d837a433ed9b533a212d6bfc9be5c09629',
                reference: 'CnRvAAAAWu8A8homZSAqIgIaosBII5MjZ1T6Azf14qwmJbipAH6PCFsYbk9p4OM5NQqnPK453bWhgZxXnzaCfy552YBmaofVfziMPUp1Wu-ctPtjiuMrTyRW93APY-A8rmdgvgdE3hlG_W1EJ-gRw0VghjOb8xIQCZ3cpytZq29YQ4Yl4OMSFRoUR20iAZN6-KoZpa8NlNsLKK4YHbE'
            };
            request
                .post('/api/races/' + id + '/waypoints')
                .send(testInfo)
                .expect('Content-Type', /json/)
                .expect(200) //Status code
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.body).to.have.property('msg');
                    expect(res.body.msg).to.equal('');
                    reference = testInfo.reference;
                    done();
                });
        });
        it('should return an error (500) the referenceid doesn\'t exist in google places', function (done) {
            var testInfo = {
                id: 'test',
                reference: 'test'
            };
            request
                .post('/api/races/' + id)
                .send(testInfo)
                .expect('Content-Type', /json/)
                .expect(500) //Status code
                .end(done);
        });
    });
    describe('getting waypoints of race', function () {
        it('should return the waypoints of a race', function (done) {
            
            var expectedOutputOfArray = [{
                name: "Café Bar De Comm Groesbeek",
                reference: "CnRvAAAAWu8A8homZSAqIgIaosBII5MjZ1T6Azf14qwmJbipAH6PCFsYbk9p4OM5NQqnPK453bWhgZxXnzaCfy552YBmaofVfziMPUp1Wu-ctPtjiuMrTyRW93APY-A8rmdgvgdE3hlG_W1EJ-gRw0VghjOb8xIQCZ3cpytZq29YQ4Yl4OMSFRoUR20iAZN6-KoZpa8NlNsLKK4YHbE",
                id: "551991389fc419701faca8f7"
            }];
            
            request
                .get('/api/races/' + id + '/waypoints')
                .expect('Content-Type', /json/)
                .expect(200) //Status code
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.body).to.have.property('array');
                    expect(res.body).to.have.property('race');
                    // deep equal compares two arrays in the right way ( with to.equal() it won't work )
                    expect(res.body.array).to.deep.equal(expectedOutputOfArray);
                    done();
                });
        });
    });
    describe('deleting waypoint of race', function () {
        it('should delete a waypoint of a race', function (done) {
            var testData = {
                reference: reference
            };
            request
                .delete('/api/races/' + id + '/waypoints')
                .send(testData)
                .expect('Content-Type', /json/)
                .expect(200) //Status code
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('msg');
                    done();
                });
        });
    });
//    describe('adding users to race', function () {
//        it('should add a user to a race', function (done) {
//            request
//                .post('/api/races/' + id + '/users')
//                .expect('Content-Type', /json/)
//                .expect(200) //Status code
//                .end(function (err, res) {
//                    if (err) {
//                        throw err;
//                    }
//                    expect(res.body).to.have.property('msg');
//                    expect(res.body.msg).to.equal('');
//                    done();
//                });              
//        });
//    });
    describe('get users to race', function () {
        it('should get all users of a race', function (done) {
            request
                .get('/api/races/' + id + '/users')
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
    describe('deleting race', function () {
        it('should delete a race', function (done) {
            request
                .delete('/api/races/' + id)
                .expect('Content-Type', /json/)
                .expect(200) //Status code
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('msg');
                    done();
                });
        });
    });
});

describe('Testing race route', function () {
    var testRace = new Race({name: 'testRace'});
    testRace.save();
    describe('rendering race home page', function(){
        it('should render the race page', function(done){
            request
                .get('/races')
                .expect('Content-Type', /html/)
                .expect(200) //Status code
                .expect(/Race lijst/)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    done();
                });
        });
    });
    describe('rendering specific race page', function(){
        it('should render specific race information page', function(done){
            request
                .get('/races/' + testRace._id)
                .expect('Content-Type', /html/)
                .expect(200) //Status code
                .expect(/Waypoints in deze race/)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    done();
                });
        });
    });
});