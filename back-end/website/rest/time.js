module.exports = function(app) {

  app.get('/v1/time', function(req, res) {
    res.send(new Date().toISOString());
  });


};
