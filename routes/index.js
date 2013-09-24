var userManager = require('../managers/userManager.js');

exports.index = function (req, res) {
    res.render('index', { isAdmin: UserManager.isAdmin(req) });
};