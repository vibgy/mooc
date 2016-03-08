var jsonParser = require('./jsonCmdLineParser.js');
var Answers = require('./answers.js');
var DEBUG = 1;

function processObj(o) {
  if (DEBUG) console.log("Object from parser: ", o);
  try {
    var ob = JSON.parse(o);
    if (DEBUG) console.log("After JSON.parse: ", ob);
debugger;
    AnswerPriceIndices.process(ob);
  } catch (e) {
    console.log("Oops ", e.message);
    return;
  }  
}

function done() {
  console.log("done");
  // console.log(AnswerPriceIndices.allResults());
  var pResults = AnswerPriceIndices.allResults();
  var a = Object.keys(pResults);
  a.forEach(function (key) {
    console.log(pResults[key].getMostExpensive());
  })
}

var AnswerPriceIndices = new Answers(5);
new jsonParser(processObj, done);
