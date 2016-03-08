var jsonParser = require('./jsonCmdLineParser.js');
var Answers = require('./answers.js');
var DEBUG = process.env.DEBUG || 0;

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

function done() {
  var pResults = answers.mostExpensiveItems();
  var a = Object.keys(pResults);
  a.forEach(function (key) {
    console.log(pResults[key].getMostExpensive());
  });

  var lCds = answers.longRunningCDs();
  console.log(lCds);

  var authors = answers.authorsWithCdAndBook();
  console.log(authors);

  var lastOne = answers.boringLastResult();
  console.log(lastOne);
}

var answers = new Answers(
  {
    n: 5,
    runningTimeThreshold: 60, // minutes
    authorFor: ["cd", "book"],
    randomCondition: function (item) {
      if ((item.title || item.track || item.chapter) && (item.year)) {
        return true;
      }
      return false;
    }
  });
new jsonParser(processObj, done);
