/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/
/*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  
test('#example Test GET /api/books', function (done) {
  chai.request(server)
    .get('/api/books')
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.isArray(res.body, 'response should be an array');
      assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
      assert.property(res.body[0], 'title', 'Books in array should contain title');
      assert.property(res.body[0], '_id', 'Books in array should contain _id');
      done();
    });
});
  /*
  * ----[END of EXAMPLE TEST]----*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  suite('API ROUTING FOR /api/threads/:board', function () {

    suite('POST', function () {

      chai.request(server)
        .post('/api/threads/:board')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(thread, 'thread should be an object');
          assert.property(thread._id, '_id', 'Thread in object should contain _id');
          assert.property(thread.text, 'text', 'Thread in object should contain text');
          assert.property(thread.delete_password, 'delete_password', 'Thread in object should contain delete_password');
          done();
        });


    });

    suite('GET', function () {
      chai.request(server)
        .get('/api/threads/:board')
        .query({ board: req.params.board })
        .end(function (err, res) {

          assert.equal(res.status, 200, 'response status should be 200');
          assert.equal(req.params.board, ':board', 'input request should be ":board"');

          done();

        });
    });

    suite('DELETE', function () {
      chai.request(server)
        .delete('/api/threads/:board')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(messageBoard, 'messageBoard should be an object');
          assert.property(messageBoard._id, '_id', 'messageBoard in object should contain _id');

          done();
        });
    });

    suite('PUT', function () {
      chai.request(server)
        .put('/api/threads/:board')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(messageBoard, 'messageBoard should be an object');
          assert.property(messageBoard._id, '_id', 'messageBoard in object should contain _id');
          done();
        });
    });


  });

  suite('API ROUTING FOR /api/replies/:board', function () {

    suite('POST', function () {
      chai.request(server)
        .post('/api/replies/:board')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(messageBoard, 'messageBoard should be an object');
          assert.property(thread._id, '_id', 'messageBoard in object should contain _id');
          assert.property(thread.text, 'text', 'messageBoard in object should contain text');
          assert.property(thread.delete_password, 'delete_password', 'messageBoard in object should contain delete_password');
          done();
        });
    });

    suite('GET', function () {
      chai.request(server)
        .get('/api/replies/:board')
        .query({ _id: req.query.thread_id })
        .end(function (err, res) {

          assert.equal(res.status, 200, 'response status should be 200');
          assert.equal(_id, 'req.query.thread_id', 'input request should be "req.query.thread_id"');

          done();

        });
    });

    suite('PUT', function () {
      chai.request(server)
        .put('/api/replies/:board')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(messageBoard, 'messageBoard should be an object');
          assert.property(messageBoard._id, '_id', 'messageBoard in object should contain _id');
          done();
        });
    });
    });

    suite('DELETE', function () {
      chai.request(server)
        .delete('/api/threads/:board')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(rmvArr, 'rmvArr should be an object');
          assert.property(rmvArr._id, '_id', 'rmvArr in object should contain _id');

          done();
        });
    });

  });

});
