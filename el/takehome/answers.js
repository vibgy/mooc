var PriceIndices = {};

var PriceIdxTrackN = function(category, trackN) {
  // note the category
  var category = category;

  // keep a sorted list of the most expensive items
  // ECMA 6
  // var topN     = Array(trackN).fill(0);
  var topN     = new Array(trackN);
  for (var i = 0; i < trackN; i++) {
    topN[i] = 0;
  };

  this.checkAndAdd = function(item) {
    if (item.price > topN[0]) {
      topN[0] = item.price;
      topN.sort();
    }
  };

  this.getMostExpensive = function() {
    return topN;
  }

  this.saveInDb = function() {
    // stub for now
  }
};

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
  },
  categoryResults: function(type) {
    return PriceIndices[type];
  },
  allResults: function() {
    return PriceIndices;
  }
 };
}

module.exports = AnswerPriceIndices;
