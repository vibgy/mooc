var assert = require('assert');

describe('Inventory Manager', function() {

  describe('Command Line Object Parser', function () {
    var jsonParser = require('./jsonCmdLineParser.js');
    var stdin;
    beforeEach(function () {
      stdin = require('./mock-stdin').stdin();
    });

    it('should allocate a new parser', function () {
      var p = new jsonParser(function() {}, process.stdin, function() {});
      assert(p);
    });

    it('should only allocate a singleton parser', function () {
      var p = new jsonParser(function() {}, process.stdin, function() {});
      assert(p);
      var pAnother = new jsonParser(function() {}, process.stdin, function() {});
      assert(pAnother);
      assert(pAnother !== p);
    });

    it('should not find any item on the command line, if the input file stream is empty', function (done) {
      var op = require('fs').createWriteStream('test123.json', {flags: 'w+'});
      //op.write("{test: 123}\r\n");
      //op.write("{test: 123}\r\n");
      var inp = require('fs').createReadStream('test123.json');
      inp.setEncoding = 'utf-8';
      process.nextTick( function () {
        op.end();
      });

      var p = new jsonParser(
        function(l) {
          // this should not hit
          assert(false);
        },
        inp, 
        function() {
          done();
        });
    });

    it('should find items, if the input file stream is has objects', function (done) {
      var op = require('fs').createWriteStream('test123.json', {flags: 'w+'});
      op.write("{test: 123}\r\n");
      op.write("{test: 234}\r\n");
      var inp = require('fs').createReadStream('test123.json');
      inp.setEncoding = 'utf-8';
      process.nextTick( function () {
        op.end();
      });

      var p = new jsonParser(
        function(l) {
          // this should not hit
          assert(l.match(/test/));
        },
        inp, 
        function() {
          done();
        });
    });

    // TODO: Something not working with Mock
    it.skip('should not find any item on the command line, if stdin stream is empty', function (done) {
      stdin.setEncoding = 'utf-8';
      stdin.resume();
      process.nextTick( function () {
        stdin.write("\r\n");
        stdin.end();
      });

      var p = new jsonParser(
        function(l) {
          // this should not hit
          assert(false);
        },
        stdin, 
        function() {
          done();
        });
    });

    it('should find an item on the command line, for valid input', function () {
      var p = new jsonParser(function() {}, process.stdin, function() {});
    });

  });

});

