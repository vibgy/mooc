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
      assert(pAnother === p);
    });

    it('should not find any item on the command line, if the input stream is empty', function (done) {
      process.nextTick( function () {
        stdin.write("{test: 123}");
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

