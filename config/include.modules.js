module.exports = app = require('express')();
module.exports = http = require('http').Server(app);
module.exports = io = require('socket.io')(http);
module.exports = mysql = require('mysql');
module.exports = _ = require('lodash');