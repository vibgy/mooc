
var stream = require('stream');
var util = require('util');

function MockStdin() {

  var data;

  var write = function (chunk, encoding, callback) {
    console.log(chunk);
    data = chunk;
    callback();
  }

  var read = function (n, callback) {
    console.log(n);
    this.push(data);
    callback();
  }

  stream.Duplex.call(this, {read: read, write: write});

}

util.inherits(MockStdin, stream.Duplex);

var singleton;

module.exports = {
  stdin: function() {
    if (!singleton) {
      singleton = new MockStdin();
    }
    return singleton;
  }
}
