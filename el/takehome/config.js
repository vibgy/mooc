module.exports = {
  n: 5,
  runningTimeThreshold: 60, // minutes
  authorFor: ["cd", "book"],
  randomCondition: function (item) {
    // TODO: I'm not sure I understood this one properly
    if ((item.title || item.tracks || item.chapter) && (item.year)) {
      return true;
    }
    return false;
  }
};
