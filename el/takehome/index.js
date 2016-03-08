var jsonParser = require('./jsonCmdLineParser.js');
var DEBUG = 1;

function processObj(o) {
  if (DEBUG) console.log("Object from parser: ", o);
  try {
    var ob = JSON.parse(o);
    if (DEBUG) console.log("After JSON.parse: ", ob);
  } catch (e) {
    console.log("Oops ", e.message);
  }
}

function done() {
  console.log("done");
}

new jsonParser(processObj, done);
