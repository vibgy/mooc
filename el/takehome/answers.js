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
};

// this is not a singleton by design. we want to be able to provide multiple trackN indices
function Indexes(opts) {
 var options = opts || {
    n: 5,
    runningTimeThreshold: 60, // minutes
    authorFor: ["cd", "book"],
    randomCondition: function (item) {
      if ((item.title || item.track || item.chapter) && (item.year)) {
        return true;
      }
      return false;
    }
  };

 return {
  process: function(item) {
    var type = item.type || "default";
    try {
      PricingIndex[type].checkAndAdd(item);
    } catch (e) {
      PricingIndex[type] = new PriceIdxTrackN(type, options.n);
      PricingIndex[type].checkAndAdd(item);
    }

    if (options.randomCondition(item)) {
      titleOrTrackOrChapterWithYear.push(item);
    }

    if (!AuthorIndex[item.author]) AuthorIndex[item.author] = {}; 

    // Type specific processing
    if (type === "cd") {
      item = require('./cd.js')().preProcessing(item);
      if (item.runningTime > options.runningTimeThreshold * 60) {
        RunningTimeIndex.push(item);
      }
    }

    // info about author
    if (options.authorFor.indexOf(type) >= 0) {
      AuthorIndex[item.author][type] = true;
    }

  },
  mostExpensiveItems: function() {
    return PricingIndex;
  },
  longRunningCDs: function() {
    return RunningTimeIndex;
  },
  authorsWithCdAndBook: function() {
    return Object.keys(AuthorIndex).filter(function (item) {
      var cond = true;
      options.authorFor.forEach( function (key) {
        cond = cond && AuthorIndex[item][key];
      });
      return cond;
    });
  },
  boringLastResult: function() {
    return titleOrTrackOrChapterWithYear;
  }
 };
}

module.exports = Indexes;
