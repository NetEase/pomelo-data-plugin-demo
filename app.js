var util = require('util');
var application = require('./application');
var dataPlugin = require('pomelo-data-plugin');

var createApp = function () {
  var app = application;
  app.init();
  return app;
};

var app = createApp();

// load/watch config file's data
app.use(dataPlugin, {
  watcher: {
    dir: __dirname + '/config/data',
    idx: 'id',
    interval: 3000
  }
});


var cb = function() {
  var npcTalkConf = null
    , teamConf = null;

  var getConf = function() {
    npcTalkConf = app.get('dataService').get('npc_talk');
    teamConf = app.get('dataService').get('team');
  };

  var printConf = function() {
    console.warn('\n', (new Date()).getTime(), ': npcTalkConf = ', util.inspect(npcTalkConf, {showHidden: true, depth: null}))
    console.warn('\n', (new Date()).getTime(), ': teamConf = ', util.inspect(teamConf, {showHidden: true, depth: null}))
    console.warn('==============================================');
  };

  getConf();
  printConf();

  setInterval(function() {
    getConf();
    printConf(); }, 5000);
};

//start
app.start(cb);

// Uncaught exception handler
process.on('uncaughtException', function(err) {
  console.error(' Caught exception: ' + err.stack);
});

