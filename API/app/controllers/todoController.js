// Load Model
var Todo = require('../models/todo');


module.exports = {

  /**
  * Get All todos
  */
  getAll: function(req, res, next) {
    Todo.find(function(err, todos) {
      if (err) res.send(err);
      res.json(todos);
    });
  },

  /**
  * Get one todo by id
  */
  get: function(req, res, next) {
    Todo.findById(req.params.id, function(err, todo) {
      if (err) res.send(err);
      res.json(todo);
    });
  },

  /**
  * Create a new todo
  */
  post: function(req, res, next) {
    var todo = req.body.todo;

    Todo.create(todo, function(err, todo) {
      if (err) res.send(err);
      res.json(todo);

      // Send the new todo in socket
      req.socketData = todo;
      next(req, res);
    });
  },

  /**
  * Update todo by id
  */
  put: function(req, res, next) {
    Todo.findById(req.params.id, function(err, todo) {
      if (err) res.send(err);

      todo.text = req.body.todo.text || todo.text;
      todo.done = req.body.todo.done || todo.done;

      todo.save(function(err) {
        if (err) res.send(err);
        res.json({ message: 'Todo updated', status : true});

        // Send update in socket
        req.socketData = todo;
        next(req, res);
      });
    });
  },

  /**
  * Delete todo by id
  */
  delete: function(req, res) {
    Todo.remove({ _id: req.params.id }, function(err, todo) {
      if (err) res.send(err);
      res.json({message: 'Todo deleted', status : true});
    });
  }
};