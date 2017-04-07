'use strict'
const path = require('path');
const fs = require('fs');
module.exports = function(filepath, content, encoding, callback) {
  const dir = path.dirname(filepath);
  mkdirs(dir, function(){
    fs.writeFile(filepath, content, encoding, callback);
  });
};
const mkdirs = module.exports.mkdirs = function(dirpath, callback) {
  fs.stat(dirpath, function(err, stat) {
    if (stat) {
      callback();
    } else {
      const parent = path.dirname(dirpath);
      fs.mkdir(dirpath, function(err) {
        if (err) {
          mkdirs(parent, function(){
            mkdirs(dirpath,callback);
          });
        } else {
          callback();
        }
      });
    }
  });
};
