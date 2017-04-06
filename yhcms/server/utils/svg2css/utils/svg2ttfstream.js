'use strict'
const Writable = require('stream').Writable;
const util = require('util');
const svg2ttf = require('svg2ttf');
const fs = require('fs');
function TTFStream(options) {
  if (!(this instanceof TTFStream)) {
    return new TTFStream(options);
  }
  Writable.call(this, options);
  this.filepath = options.fp;
  this._data = [];
  this._size = 0;
}

module.exports = TTFStream;

util.inherits(TTFStream, Writable);

TTFStream.prototype._write = function(chunk, encoding, cb) {
  if (!util.isBuffer(chunk)) {
    chunk = new Buffer(chunk, encoding);
  }
  this._data.push(chunk);
  this._size += chunk.length;
  cb();
}

TTFStream.prototype.end = function(data, encoding) {
  data && this.write(data, encoding);
  const buf = Buffer.concat(this._data);
  const ttf = new Buffer(svg2ttf(buf.toString(encoding || 'utf8'), {}).buffer);
  const self = this;
  fs.createWriteStream(this.filepath).write(ttf, function() {
    self.emit('svgsuccess', ttf);
  });
}
