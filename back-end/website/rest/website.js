var rawLogSchema = require('../models/rawlogmodel.js').rawLogSchema;
var calibrationModel = require('../models/calibration.js');
var mongoose = require('mongoose');
var moment = require('moment-timezone');

module.exports = function(app) {

  app.post('/api', function(req, res) {
    var outputData=[];
    var collection_name = "posts.d"+req.body.site_id;
    var devID = req.body.channel;
    //console.log(req.body);
    calibrationModel.find({})
    .catch(function(err){
        console.log(err);
    })
    .then(function(calibdata){
      var nodecalibs = {};
      calibdata.forEach(function(cc){
        if (cc['devId'] == devID){
            nodecalibs = cc;
        }
      });
      var siteModel = mongoose.model('siteModel', rawLogSchema,'posts.alldata');
      siteModel.find({'devID':devID}).sort({serverDt: -1}).limit(parseInt(req.body.count))
      .catch(function(err){
        console.log("error");
      })
      .then(function(data){
        data.forEach(function(temp_data){
          // calibration
          temp_data = temp_data.toObject();
          temp_data["serverDt"].setSeconds(0);
          temp_data["serverDt"].setMilliseconds(0);
          //DANGEROUS//
          temp_data["date"]= moment(temp_data["serverDt"]).format("DD-MM-YYYY");
          temp_data["time"]= moment(temp_data["serverDt"]).utcOffset(-temp_data["serverDt"].getTimezoneOffset() * 60 * 1000).format("HH:mm");
          delete temp_data['serverDt'];
          temp_data.temp1 = (temp_data.temp1*Number(nodecalibs.ffirstParam)+Number(nodecalibs.fsecondParam)).toFixed(2);
          temp_data.temp2 = (temp_data.temp2*Number(nodecalibs.lfirstParam)+Number(nodecalibs.lsecondParam)).toFixed(2);
          var outtype = nodecalibs.outputType;
          temp_data.outTemp=0
          if(outtype=="min") temp_data.outTemp = Math.min(temp_data.temp1,temp_data.temp2);
          else if(outtype=="max") temp_data.outTemp = Math.max(temp_data.temp1,temp_data.temp2);
          else if(outtype=="mean") temp_data.outTemp = ((Number(temp_data.temp1)+Number(temp_data.temp2))/2).toFixed(2);
          outputData.push(temp_data);
        });
        res.json(outputData);
      });
    });
  });

  app.post('/calibration',function(req,res){

    calibrationModel.find({}).sort({'devId':1})
    .catch(function(err){
      console.log(err);
    })
    .then(function(data){
      res.json(data);
    });
  });

  app.post('/updateCalibs',function(req,res){

  });

};
