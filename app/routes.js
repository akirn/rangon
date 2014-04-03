'use strict';

module.exports = function(app) {

  var errorout = function(res) {
    res.status(404).sendfile('/views/404.html', opts);
  };

  var opts = {root: './public'};

  app.get('/', function(req, res) {
      res.sendfile('/views/index.html', opts);
    });

  app.get('/:dir/:file', function(req, res, next) {
      var path = '/' + req.params.dir + '/' + req.params.file;

      res.sendfile(path, opts, function(err) {
        if (err.code === 'ENOENT') {
          return next();
        }
        res.send(500);
      });
    });

  app.get('*', function(req, res) {
      res.status(404).sendfile('/views/404.html', opts);
    });

};