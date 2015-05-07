var mongoose = require('mongoose');

var todoSchema = mongoose.Schema({
  text: String,
  done: Boolean
}, { versionKey: false });

module.exports = mongoose.model('Todo', todoSchema);