var PriceIndices = {};

var PriceIdxTrackN = function(type, trackN) {
  // note the category
  var category = type;

  // keep a sorted list of the most expensive items
  // ECMA 6
  // var topN     = Array(trackN).fill(0);
  var topN     = new Array(trackN);
  for (var i = 0; i < trackN; i++) {
    topN[i] = 0;
  }

  this.checkAndAdd = function(item) {
    if (item.price > topN[0]) {
      topN[0] = item.price;
      topN.sort();
    }
  };

  this.getMostExpensive = function() {
    return topN;
  };

  this.saveInDb = function() {
    // stub for now
  };
};

// CDs longer than 60 minutes
var longCds = [];

// Data by author
var AuthorData = {};

// this is not a singleton by design. we want to be able to provide multiple trackN indices
function AnswerPriceIndices(n) {
 return {
  num: n,
  process: function(item) {
    var type = item.type || "default";
    try {
      PriceIndices[type].checkAndAdd(item);
    } catch (e) {
      PriceIndices[type] = new PriceIdxTrackN(type, this.num);
      PriceIndices[type].checkAndAdd(item);
    }

    if (!AuthorData[item.author]) AuthorData[item.author] = {}; 

    // Type specific processing
    if (type === "cd") {
      item = require('./cd.js')().preProcessing(item);
      if (item.runningTime > 60 * 60) {
        longCds.push(item);
      }
      AuthorData[item.author].hasCd = true;
    }

    // info about author
    if (["book"].indexOf(type) >= 0) {
      AuthorData[item.author].hasBook = true;
    }

  },
  categoryResults: function(type) {
    return PriceIndices[type];
  },
  allResults: function() {
    return PriceIndices;
  },
  longRunningCDs: function() {
    return longCds;
  },
  authorsWithCdAndBook: function() {
    return Object.keys(AuthorData).filter(function (item) {
      return AuthorData[item].hasBook && AuthorData[item].hasCd;
    });
  }
 };
}

module.exports = AnswerPriceIndices;
