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

function ObjParser(processObject, input, done) {
  var stream = require('readline').createInterface({
    input: input
  });

  stream.on('line', function (inputLine) {
    inputLine = inputLine || "";
    var lines = inputLine.replace(/\{/g, "\n\{").replace(/\}/g, "\n\}").trim().split("\n");
    if (DEBUG) console.log("Lines : ", lines);
    lines.forEach(function (l) {
      var start, end;
      // find an object
      if (!obj) {
        // look for start;
        start = containsStartOfObject(l);
        if (start) {
          obj = start;
          symbolStack.push("{");
        }
        return;
      }
 
      start = containsStartOfObject(l);
      if (start) {
        obj = obj + start;
        symbolStack.push("{");
        return;
      }
 
      end = containsEndOfObject(l);
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
    done();
  });
}

module.exports = function (processObject, input, done) {
  var Processor = new ObjParser(processObject, input, done);
  return Processor;
};
