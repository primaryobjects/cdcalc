var config = require('../config/config'),
	remoteip = require('remoteip');

UserManager = {
	isAdmin: function (req) {
		var adminIp = remoteip.get(req);
		return ((adminIp == config.adminIp || adminIp == '127.0.0.1' || adminIp == '::1') && req.query['admin'] == '1');
	}
}