var UsersUrls = {};
var LinksCount = {};
var Max = {url1: "", url2: "", count: 0};

var stream = require('readline').createInterface({
  input: require('fs').createReadStream('log.txt')
});

stream.on('line', function (l) {
  var line = {};
  var items = l.split(/\s* \s* \s*/);

  line.url = items[2].replace(/URL:/, "");
  line.user = items[1];
  
  if (!UsersUrls[line.user]) {
    UsersUrls[line.user] = line.url || "";
    return;
  }

  var key = JSON.stringify({url1: UsersUrls[line.user], url2: line.url});
  if (!LinksCount[key])
    LinksCount[key] = {count : 0};
  LinksCount[key].count++;
  
  if (Max.count <= LinksCount[key].count) {
    Max = {url1: UsersUrls[line.user], url2: line.url, count: LinksCount[key].count};
  }
  UsersUrls[line.user].url = line.url || "";
});

stream.on('close', function() {
  console.log(Max);
});
