var equal = require('deep-equal');

module.exports = function (data, db, callback) {
  if (!data._id && data.id) data._id = data.id;
  
  db.insert(data, data._id, function (err, res) {
    if (err && err.error === 'conflict') {
      db.get(data._id, function (err, doc) {
        data._rev = doc._rev;
        if (!equal(data, doc)) db.insert(data, data._id, callback);
      });
    } else {
      callback();
    }
  });
}