var inherits = require('util').inherits;
var Writable = require('stream').Writable;
var nano = require('nano');
var insertOrUpdate = require('./lib/insert-or-update');
  
function CouchStream(db, options) {
  if (!(this instanceof CouchStream)) {
    return new CouchStream(db, options);
  }
  
  if (!options) options = {};
  options.objectMode = true;
  
  this.couch = nano(options.url || 'http://localhost:5984');
  this.db = this.couch.use(db);
 
  Writable.call(this, options);
}

inherits(CouchStream, Writable);

CouchStream.prototype._write = function (data, encoding, callback) {
  insertOrUpdate(data, this.db, function (err, res) {
    callback();
  });
};
 
module.exports = CouchStream;