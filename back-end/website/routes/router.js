var session = require('express-session');
var path = require('path');

module.exports = function(app) {
  var sess;
   app.get('/', function(req, res) {
     sess = req.session;
     if(sess.username) {
         //res.sendFile(path.resolve('/front-end/index.html'));
        res.sendFile(path.resolve('./index.html'));
     }
     else {
        res.sendFile(path.resolve('./front-end/views/pages/login.html'));
        //res.sendFile("/home/mkaanerkoc/Desktop/Erdemir-STS Website//public/login.html");
     }

   });

   app.post('/login',function(req,res){
     var username = req.body.username;
     var password = req.body.password;

     //console.log(req.body);
     if(username=='admin'&&password=='Erdemir12345'){
       sess = req.session;
       sess.username=req.body.username;
       res.send('admin-user');
     }
     else if(username=='user'&&password=='12345'){
       sess = req.session;
       sess.username=req.body.username;
       res.send('normal-user');
     }
     else{
       res.end('done');
     }

   });

};
