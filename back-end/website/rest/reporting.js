var rawLogSchema = require('../models/rawlogmodel.js').rawLogSchema;
var calibrationModel = require('../models/calibration.js');
var mongoose = require('mongoose');
var moment = require('moment-timezone');
var OuterData = [];

// UTIL FUNCTIONS //
function groupBy( array , f )
{
  var groups = {};
  array.forEach( function( o )
  {
    var group = JSON.stringify( f(o) );
    groups[group] = groups[group] || [];
    groups[group].push( o );
  });
  return Object.keys(groups).map( function( group )
  {
    return groups[group];
  })
}


module.exports = function(app) {
  var calibrationDatas = [];

  app.post('/report', function(req, res) {
    console.log(req.body);
    var outputData=[];
    var collection_name = "posts.d"+req.body.channel;
    var devID =     req.body.channel;
    var timePeriod = req.body.timeperiod;

    var startDate = moment.tz(req.body.startdate, "YYYY/MM/DD HH:mm", "Europe/Istanbul").toDate();
    var endDate   = moment.tz(req.body.enddate,   "YYYY/MM/DD HH:mm", "Europe/Istanbul").toDate();
    //DANGEROUS//
    startDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000);
    endDate   = new Date(endDate.getTime()   - endDate.getTimezoneOffset()   * 60 * 1000);
    //DANGEROUS//
    var betweenDatesQuery = {"serverDt":{"$gte":startDate,"$lte":endDate}};
    calibrationModel.find({})
    .catch(function(err){
        console.log(err);
    })
    .then(function(calibdata){
      var nodecalibs = calibdata.filter(function(cc){
        return cc['devId'] == devID;
      });
      nodecalibs = nodecalibs[0];
      var siteModel = mongoose.model('siteModel', rawLogSchema,collection_name);
      siteModel.find(betweenDatesQuery).sort({serverDt: -1})
      .catch(function(err){
        console.log("error");
      })
      .then(function(data){
        data.map(function(td){
          td = td.toObject();
          td["serverDt"].setSeconds(0);
          td["serverDt"].setMilliseconds(0);
          //DANGEROUS//
          td["date"]= moment(td["serverDt"]).format("DD-MM-YYYY");
          td["time"]= moment(td["serverDt"]).utcOffset(-td["serverDt"].getTimezoneOffset() * 60 * 1000).format("HH:mm");
          //DANGEROUS//
          delete td["nodeDt"];
          delete td["serverDt"];

          td.temp1 = (td.temp1*Number(nodecalibs.ffirstParam)+Number(nodecalibs.fsecondParam)).toFixed(2);
          td.temp2 = (td.temp2*Number(nodecalibs.lfirstParam)+Number(nodecalibs.lsecondParam)).toFixed(2);
          td.outTemp=0
          if(nodecalibs.outputType=="min")       td.outTemp = Math.min(td.temp1,td.temp2);
          else if(nodecalibs.outputType=="max")  td.outTemp = Math.max(td.temp1,td.temp2);
          else if(nodecalibs.outputType=="mean") td.outTemp = ((Number(td.temp1)+Number(td.temp2))/2).toFixed(2);
          outputData.push(td);
        });
        var a = outputData;
        var lastOutputData=[];
        while(a.length) {
            var b = [];
            var c = {};
            b = a.splice(0,timePeriod);

            c["date"] = b[0]["date"];
            c["time"] = b[0]["time"];
            c["devID"]    = b[0]["devID"];
            c["tempC"]    = Math.round(b.reduce(function(sum, a) { return sum + a.tempC },0)/(b.length||1)*100)/100;
            c["humdC"]    = Math.round(b.reduce(function(sum, a) { return sum + a.humdC },0)/(b.length||1)*100)/100;
            c["temp1"]    = Math.round(b.reduce(function(sum, a) { return sum + Number(a.temp1) },0)/(b.length||1)*100)/100;
            c["temp2"]    = Math.round(b.reduce(function(sum, a) { return sum + Number(a.temp2) },0)/(b.length||1)*100)/100;
            c["outTemp"]  = Math.round(b.reduce(function(sum, a) { return sum + a.outTemp },0)/(b.length||1)*100)/100;
            c["rssi"]     = Math.round(b.reduce(function(sum, a) { return sum + a.rssi },0)/(b.length||1)*100)/100;

            lastOutputData.push(c);
        }
        res.json(lastOutputData);
      });
    });

  });
  var calibrationDatas = [];
  app.post('/report_demo', function(req, res) {

    var outputData=[];
    var devID = parseInt(req.body.channel);
    var timePeriod = req.body.timeperiod;

    var startDate = moment.tz(req.body.startdate, "YYYY/MM/DD HH:mm", "Europe/Istanbul").toDate();
    var endDate   = moment.tz(req.body.enddate,   "YYYY/MM/DD HH:mm", "Europe/Istanbul").toDate();
    //DANGEROUS//
    startDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000);
    endDate   = new Date(endDate.getTime()   - endDate.getTimezoneOffset()   * 60 * 1000);
    //DANGEROUS//
    var betweenDatesQuery = {}
    if(devID!=91&&devID!=92)
      betweenDatesQuery = {$and:[{'serverDt':{$gte:startDate,$lte:endDate}},{'devID': parseInt(devID) }]}
    else if(devID==91||devID==92)
      betweenDatesQuery = {'serverDt':{$gte:startDate,$lte:endDate}}

    calibrationModel.find({})
    .then(function(calibdata){
      var nodecalibs = calibdata.filter(function(cc){
        return cc['devId'] == devID;
      });
      nodecalibs = nodecalibs[0];
      var siteModel = mongoose.model('siteModel', rawLogSchema,'posts.alldata');
      siteModel.find(betweenDatesQuery).sort({serverDt: -1})
      .then(function(data){
        data.map(function(td){
          td = td.toObject();
          td["serverDt"].setSeconds(0);
          td["serverDt"].setMilliseconds(0);
          //DANGEROUS//
          td["date"]= moment(td["serverDt"]).format("DD-MM-YYYY");
          td["time"]= moment(td["serverDt"]).utcOffset(-td["serverDt"].getTimezoneOffset() * 60 * 1000).format("HH:mm");
          //DANGEROUS//
          delete td["nodeDt"];
          delete td["serverDt"];

          td.temp1 = (td.temp1*Number(nodecalibs.ffirstParam)+Number(nodecalibs.fsecondParam)).toFixed(2);
          td.temp2 = (td.temp2*Number(nodecalibs.lfirstParam)+Number(nodecalibs.lsecondParam)).toFixed(2);
          td.outTemp=0
          if(nodecalibs.outputType=="min")       td.outTemp = Math.min(td.temp1,td.temp2);
          else if(nodecalibs.outputType=="max")  td.outTemp = Math.max(td.temp1,td.temp2);
          else if(nodecalibs.outputType=="mean") td.outTemp = ((Number(td.temp1)+Number(td.temp2))/2).toFixed(2);
          outputData.push(td);
        });
        var a = outputData;
        var lastOutputData={};
        lastOutputData.cols = cols;
        lastOutputData.props = props;
        lastOutputData.rows = [];
        while(a.length) {
            var b = [];
            var c = {};
            b = a.splice(0,timePeriod);
            c["date"] = b[0]["date"];
            c["time"] = b[0]["time"];
            c["devID"]    = b[0]["devID"];
            //c["mCrc"]     = b[0]["mCrc"];
            c["tempC"]    = Math.round(b.reduce(function(sum, a) { return sum + a.tempC },0)/(b.length||1)*100)/100;
            c["humdC"]    = Math.round(b.reduce(function(sum, a) { return sum + a.humdC },0)/(b.length||1)*100)/100;
            c["temp1"]    = Math.round(b.reduce(function(sum, a) { return sum + Number(a.temp1) },0)/(b.length||1)*100)/100;
            c["temp2"]    = Math.round(b.reduce(function(sum, a) { return sum + Number(a.temp2) },0)/(b.length||1)*100)/100;
            c["outTemp"]  = Math.round(b.reduce(function(sum, a) { return sum + a.outTemp },0)/(b.length||1)*100)/100;
            c["rssi"]     = Math.round(b.reduce(function(sum, a) { return sum + a.rssi },0)/(b.length||1)*100)/100;
            lastOutputData.rows.push(c);
        }
        res.json(lastOutputData);
      });
    });
  });



  app.post('/report_demoo', function(req, res) {
    var responseData={};
    var channelIDs = req.body.channel.map(function(e){return {'devID':e};});
    var timePeriod = parseInt(req.body.timeperiod);
    var startDate = moment.tz(req.body.startdate, "YYYY/MM/DD HH:mm", "Europe/Istanbul").toDate();
    var endDate   = moment.tz(req.body.enddate,   "YYYY/MM/DD HH:mm", "Europe/Istanbul").toDate();

    //DANGEROUS//
    startDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000);
    endDate   = new Date(endDate.getTime()   - endDate.getTimezoneOffset()   * 60 * 1000);
    //DANGEROUS//

    var betweenDatesQuery = {
    $and : [
        {'serverDt':{$gt:startDate,$lte:endDate}},
        { $or : channelIDs }
      ]
    }
    calibrationModel.find({})
    .then(function(calibdata){
      var siteModel = mongoose.model('siteModel', rawLogSchema,'posts.alldata');
      siteModel.find(betweenDatesQuery).sort({serverDt: -1}).then(function(data){
        var channelDataArray = groupBy(data,function(item){return item.devID;});
        responseData={};
        responseData.cols=['Tarih','Saat'];
        channelIDs.map(function(d){
          switch(d['devID']){
            case 1:
              responseData.cols.push("Kuzey 500 Metre (℃)");
              break;
            case 2:
              responseData.cols.push("Kuzey Su Alma Yapısı (℃)");
              break;
            case 3:
              responseData.cols.push("Kuzey 0 Noktası (℃)");
              break;
            case 4:
              responseData.cols.push("Kuzey 100 Metre (℃)");
              break;
            case 5:
              responseData.cols.push("Kuzey 75 Metre (℃)");
              break;
            case 6:
              responseData.cols.push("Kuzey 50 Metre (℃)");
              break;
            case 8:
              responseData.cols.push("Güney 50 Metre (℃)");
              break;
            case 9:
              responseData.cols.push("Güney 75 Metre (℃)");
              break;
            case 10:
              responseData.cols.push("Güney 100 Metre (℃)");
              break;
          }
        });
        responseData.datas=[];
        responseData.rows=[];
        var outputData = []
        channelDataArray.forEach(function(data,i){
          var nodecalibs=calibdata.filter(function(cc){return cc['devId'] == data[0].devID;})[0];

          data.map(function(td){
            td = td.toObject();
            td["serverDt"].setSeconds(0);
            td["serverDt"].setMilliseconds(0);
            //DANGEROUS//
            td["date"]= moment(td["serverDt"]).format("DD-MM-YYYY");
            td["time"]= moment(td["serverDt"]).utcOffset(-td["serverDt"].getTimezoneOffset() * 60 * 1000).format("HH:mm");
            //DANGEROUS//
            delete td["nodeDt"];
            delete td["serverDt"];
            td.temp1 = (td.temp1*Number(nodecalibs.ffirstParam)+Number(nodecalibs.fsecondParam)).toFixed(2);
            td.temp2 = (td.temp2*Number(nodecalibs.lfirstParam)+Number(nodecalibs.lsecondParam)).toFixed(2);
            td.outTemp=0
            if(nodecalibs.outputType=="min")       td.outTemp = Math.min(td.temp1,td.temp2);
            else if(nodecalibs.outputType=="max")  td.outTemp = Math.max(td.temp1,td.temp2);
            else if(nodecalibs.outputType=="mean") td.outTemp = ((Number(td.temp1)+Number(td.temp2))/2).toFixed(2);
            outputData.push(td);
          });
          var a = outputData;
          var obj = {};
          obj.rows=[];
          while(a.length) {
              var b = [];
              var c = {};
              b = a.splice(0,timePeriod);
              c["date"] = b[0]["date"];
              c["time"] = b[0]["time"];
              c["devID"]    = b[0]["devID"];
              c["temp1"]    = Math.round(b.reduce(function(sum, k) { return sum + Number(k.temp1) },0)/(b.length||1)*100)/100;
              c["temp2"]    = Math.round(b.reduce(function(sum, k) { return sum + Number(k.temp2) },0)/(b.length||1)*100)/100;
              c["outTemp"]  = Math.round(b.reduce(function(sum, k) { return sum + Number(k.outTemp) },0)/(b.length||1)*100)/100;
              responseData.datas.push(c);
          }
          responseData.rows = groupBy(responseData.datas,function(item){return [item.time,item.date]});
        });
        delete responseData.datas;
        res.json(responseData);
      });
    });
  });
}
