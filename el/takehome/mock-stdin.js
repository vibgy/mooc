
var stream = require('stream');
var util = require('util');

function MockStdin() {

  var data;

  var write = function (chunk, encoding, callback) {
    console.log(chunk);
    data = chunk;
    callback();
  }

  var read = function (n) {
    // console.log(data);
    this.push(data);
  }

  stream.Duplex.call(this, {read: read, write: write});

}

util.inherits(MockStdin, stream.Duplex);

module.exports = {
  stdin: function() {
    var s = new MockStdin();
    return s;
  }
}
