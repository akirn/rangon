'use strict';

module.exports = function(app) {

  app.get('/', function(req, res) {
      res.sendfile('/views/index.html', {root: './public'});
    });

  app.get('/js/:file', function(req, res) {
      res.sendfile('/js/' + req.params.file, {root: './public'});
    });

  app.get('/css/:file', function(req, res) {
      res.sendfile('/css/' + req.params.file, {root: './public'});
    });

  app.get('*', function(req, res) {
      res.send(404, 'File not found.');
    });

};