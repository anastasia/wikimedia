var path = require('path');

exports.get = function(req, res) {
  res.sendfile(path.join(__dirname, '../public/data/discussion.json'));
};