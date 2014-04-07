'use strict';

module.exports = function(app) {

  var opts = {root: './public'};

  app.get('/', function(req, res) {
      res.sendfile('/views/index.html', opts);
    });

  app.get(/^(\/[\w.-]+\/)([\w.-]+\/)?([\w.-]+)$/, function(req, res, next) {

      //var path = '/' + req.params.dir + '/' + req.params.file;
      var path = req.params.join('');
      console.log(path);

      res.sendfile(path, opts, function(err) {
        if (err && err.code === 'ENOENT') {
          return next();
        }
        res.send(500);
      });
    });

  app.get('*', function(req, res) {
      res.status(404).sendfile('/views/404.html', opts);
    });

};