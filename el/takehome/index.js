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
    console.log("Oops ", e.message);
    return;
  }  
}

function done() {
  console.log("done");
  var pResults = answers.allResults();
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

var answers = new Answers(5);
new jsonParser(processObj, done);
