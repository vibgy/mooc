var assert = require('assert');
var Answers = require('./answers.js');

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

    it.skip('should find an item on the command line, for valid input', function () {
      var p = new jsonParser(function() {}, process.stdin, function() {});
    });

  });

  describe('Answers ', function () {
    var answers = new Answers(
      {
        n: 5,
        runningTimeThreshold: 60, // minutes
        authorFor: ["cd", "book"],
        randomCondition: function (item) {
          // TODO: I'm not sure I understood this one properly
          if ((item.title || item.tracks || item.chapter) && (item.year)) {
            return true;
          }
          return false;
        }
      });
    var testJson = require('./fixtures/test.json');
    testJson.forEach( function (item) {
      answers.process(item);
    });

    it('should provide top 5 most expensive items for all categories', function() {
      var MostExpItems = {};
      testJson.forEach( function (item) {
        var type = item.type || 'default';
        if (!MostExpItems[type]) MostExpItems[type] = {priceyItem : 0};
        if (MostExpItems[type].priceyItem < item.price) MostExpItems[type].priceyItem = item.price || 0;
      });

      // lets check now
      var pResults = answers.mostExpensiveItems();
      var a = Object.keys(pResults);
      a.forEach(function (key) {
        assert(MostExpItems[key].priceyItem === pResults[key].getMostExpensive()[4]);
      });
    });

    it('should provide list of cds with longer than 60 minute running time', function() {
      var RunningTime = [];
      testJson.forEach( function (item) {
        var type = item.type || 'default';
        if (type === "cd") {
          item = require('./cd.js')().preProcessing(item);
          if (item.runningTime > 60 * 60) {
            RunningTime.push(item);
          }
        }
      });

      assert(RunningTime.length === answers.longRunningCDs().length);
    });

    it.skip('should provide authors that have released CDs also', function() {

    });

    it.skip('should provide items have a title, track, or chapter that contains a year', function() {

    });

  });

});

