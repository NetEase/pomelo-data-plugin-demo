var fs = require('fs');
var path = require('path');

var Application = module.exports = {};

Application.init = function() {
  this.loaded = []; // loaded component list
  this.settings = {}; // collection keep set/get
};

Application.use = function(plugin, opts) {
  if(!plugin.components) {
    console.error('invalid components, no components exist');
    return;
  }

  var self = this;
  var dir = path.dirname(plugin.components);

  if(!fs.existsSync(plugin.components)) {
    console.error('fail to find components, find path: %s', plugin.components);
    return;
  }

  fs.readdirSync(plugin.components).forEach(function (filename) {
    if (!/\.js$/.test(filename)) {
      return;
    }
    var name = path.basename(filename, '.js');
    var param = opts[name] || {};
    console.log('param = ', JSON.stringify(param));
    var absolutePath = path.join(dir, 'components', filename);
    if(!fs.existsSync(absolutePath)) {
      console.error('component %s not exist at %s', name, absolutePath);
    } else {
      var com = require(absolutePath);
      com = com(self, param);
      self.loaded.push(com);
    }
  });
};


Application.set = function(name, obj) {
  this.settings[name] = obj;
  return this;
};

Application.get = function (name) {
  return this.settings[name];
};

Application.start = function(cb) {
  this.loaded.forEach(function(com) {
    com.start(cb);
  });
  // ...
};

