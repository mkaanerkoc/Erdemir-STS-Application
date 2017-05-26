module.exports = function(app) {

  app.get('/v1/site/:id/channels/', function(req, res) {
    var returnObj={};
    var channels=[];
    returnObj["siteId"]=parseInt(req.params.id);
    var channel1={'id':1,'name':'Kuzey Kollektoru 500 mt.','units':'degC','address':0};
    var channel2={'id':2,'name':'Su Alma Yapisi','units':'degC','address':1};
    var channel3={'id':3,'name':'Kuzey Kollektoru 0 noktasi','units':'degC','address':2};
    var channel4={'id':4,'name':'Kuzey Kollektoru 100 mt.','units':'degC','address':3};
    var channel5={'id':5,'name':'Kuzey Kollektoru 75 mt.','units':'degC','address':4};
    var channel6={'id':6,'name':'Kuzey Kollektoru 50 mt.','units':'degC','address':5};
    var channel8={'id':8,'name':'Guney Kollektoru 50 mt.','units':'degC','address':0};
    var channel9={'id':9,'name':'Guney Kollektoru 75 mt.','units':'degC','address':1};
    var channel10={'id':10,'name':'Guney Kollektoru 100 mt.','units':'degC','address':2};

    if(parseInt(req.params.id)==1){
      channels.push(channel1);
      channels.push(channel2);
      channels.push(channel3);
      channels.push(channel4);
      channels.push(channel5);
      channels.push(channel6);
    }

    else if(parseInt(req.params.id)==2){
      channels.push(channel8);
      channels.push(channel9);
      channels.push(channel10);
    }

    returnObj["channels"]=channels;
    res.send(returnObj);
  });


};
