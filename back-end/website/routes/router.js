var session = require('express-session');
var path = require('path');

module.exports = function(app) {
  var sess;
  /*app.use(session(
          {secret: 'Okyanus1900'},
          {
            cookie: {
              path: '/',
              httpOnly: true,
              secure: false,
              resave : true,
              maxAge: 2 * 60 * 1000
            },
            rolling: true}
  ));*/

   app.get('/', function(req, res) {

    /* sess = req.session;
     if(sess.username) {
         //res.sendFile(path.resolve('/front-end/index.html'));
        console.log("here");
        res.sendFile(path.resolve('/front-end/views/pages/login.html'));
     }
     else {
        console.log("here b");
        res.sendFile(path.resolve('/front-end/views/pages/login.html'));
         //res.sendFile("/home/mkaanerkoc/Desktop/Erdemir/website/public/login.html");
     }*/

   });

};
