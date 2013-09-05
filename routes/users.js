var usersonline = require('usersonline');

exports.index = function(req, res) {
  res.render('users/index', { visitorList: usersonline.visitorList });
};
