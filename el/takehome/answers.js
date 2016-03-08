// top N expensive items
var PricingIndex = {};

// CDs longer than 60 minutes
var RunningTimeIndex = [];

// Data by author
var AuthorIndex = {};

// items have a title, track, or chapter that contains a year
var titleOrTrackOrChapterWithYear = [];

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

// this is not a singleton by design. we want to be able to provide multiple trackN indices
function AnswerPricingIndex(n) {
 return {
  num: n,
  process: function(item) {
    var type = item.type || "default";
    try {
      PricingIndex[type].checkAndAdd(item);
    } catch (e) {
      PricingIndex[type] = new PriceIdxTrackN(type, this.num);
      PricingIndex[type].checkAndAdd(item);
    }

    if ((item.title || item.track || item.chapter) && (item.year)) {
      titleOrTrackOrChapterWithYear.push(item);
    }

    if (!AuthorIndex[item.author]) AuthorIndex[item.author] = {}; 

    // Type specific processing
    if (type === "cd") {
      item = require('./cd.js')().preProcessing(item);
      if (item.runningTime > 60 * 60) {
        RunningTimeIndex.push(item);
      }
      AuthorIndex[item.author].hasCd = true;
    }

    // info about author
    if (["book"].indexOf(type) >= 0) {
      AuthorIndex[item.author].hasBook = true;
    }

  },
  categoryResults: function(type) {
    return PricingIndex[type];
  },
  allResults: function() {
    return PricingIndex;
  },
  longRunningCDs: function() {
    return RunningTimeIndex;
  },
  authorsWithCdAndBook: function() {
    return Object.keys(AuthorIndex).filter(function (item) {
      return AuthorIndex[item].hasBook && AuthorIndex[item].hasCd;
    });
  },
  boringLastResult: function() {
    return titleOrTrackOrChapterWithYear;
  }
 };
}

module.exports = AnswerPricingIndex;
