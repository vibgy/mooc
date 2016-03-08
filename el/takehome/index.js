var jsonParser = require('./jsonCmdLineParser.js');
var Answers = require('./answers.js');
var DEBUG = process.env.DEBUG || 0;

// Processes object provided by command line json object parser
function processObj(o) {
  if (DEBUG) console.log("Object from parser: ", o);
  try {
    var ob = JSON.parse(o);
    if (DEBUG) console.log("After JSON.parse: ", ob);
    answers.process(ob);
  } catch (e) {
    console.log("Oops, could not parse or process ", o, e.message);
  }  
}

// when the input stream is over, this function gets called
function done() {
  console.log("*** 5 Most expensive items *** ");
  var pResults = answers.mostExpensiveItems();
  var a = Object.keys(pResults);
  a.forEach(function (key) {
    console.log("category: ", key, pResults[key].getMostExpensive());
  });

  var lCds = answers.longRunningCDs();
  console.log("*** Long running CDs *** ");
  console.log(lCds);

  console.log("*** Authors that have published CDs also *** ");
  var authors = answers.authorsWithCdAndBook();
  console.log(authors);

  console.log("*** Items that have a title, track, or chapter that contains a year *** ");
  var lastOne = answers.boringLastResult();
  console.log(lastOne);
}

// initializing the post processing
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

// from stdin
new jsonParser(processObj, process.stdin, done);
// from file
// new jsonParser(processObj, require('fs').createReadStream('test.json'), done);
