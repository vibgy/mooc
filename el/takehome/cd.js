module.exports = function() {
  return {
    preProcessing: function(item) {
      try {
        var rtime = 0;
        item.tracks.forEach( function (track) {
          rtime += track.seconds;
        });
        item.runningTime = rtime;
      } catch (e) {
        console.log("cd: could not process record ", item);
      }
      return item;
    }
  };
};
