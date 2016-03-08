var symbolStack = [];
var obj;
var DEBUG = process.env.DEBUG || 0;

// detect these combinations:
// {
// , {
// [ { "asdjhkh" :
// }, {
// } , {

function containsStartOfObject(line) {
  var p = /,? *(\{.*)/;
  if (line.match(p)) {
    if (DEBUG) console.log("line : ");
    if (DEBUG) console.log(line.match(p)[0]);
    return line.match(p)[0];
  }
  return null;
}

// detect these combinations
// }
// }, 
// }, {
// } , {
// "asd" : 123 }
function containsEndOfObject(line) {
  var p = /(.*\})/;
  if (line.match(p)) {
    if (DEBUG) console.log("line : ");
    if (DEBUG) console.log(line.match(p)[0]);
    return line.match(p)[0];
  }
  return null;
}

function containsStartAndEnd(line) {
  var p = /(\{.*\})/;
  if (line.match(p)) {
    if (DEBUG) console.log("line : ");
    if (DEBUG) console.log(line.match(p)[0]);
    return line.match(p)[0];
  }
  return null;
}

// TODO: Make this a singleton, we dont want multiple JSON parsers parsing from stdin
function init(processObject, done) {
  var stream = require('readline').createInterface({
    //input: process.stdin
    input: require('fs').createReadStream('test.json')
  });

  stream.on('line', function (l) {
    l = l || "";
    var lines = l.replace(/\{/g, "\n\{").replace(/\}/g, "\n\}").trim().split("\n");
    if (DEBUG) console.log("Lines : ", lines);
    lines.forEach(function (l) {
      // find an object
      if (!obj) {
        // look for start;
        var start = containsStartOfObject(l);
        if (start) {
          obj = start;
          symbolStack.push("{");
        }
        return;
      }
 
      var start = containsStartOfObject(l);
      if (start) {
        obj = obj + start;
        symbolStack.push("{");
        return;
      }
 
      var end = containsEndOfObject(l);
      if (end) {
        symbolStack.pop();
        if (symbolStack.length === 0) {
          // we found one full object, lets process it
          obj = obj + end;
          processObject(obj);
          obj = null;
        } else {
          // this is inner object, we should not remove the ",".. because this object could be the part of an array
          obj = obj + l;
        }
        return;
      }
 
      // neither end nor start
      obj = obj + l;
    });
  });

  stream.on('close', function() {
    // call done when done
    console.log("great");
    done();
  });
}

module.exports = init;
