var siteModels = require('../models/rawlogmodel.js');
var calibrationModel = require('../models/calibration.js');
var mongoose = require('mongoose');
var OuterData = [];

groupData = function(data,f){
  var groups = {};
  data.forEach( function( o )
  {
    var group = JSON.stringify( f(o) );
    groups[group] = groups[group] || [];
    groups[group].push( o );
  });
  return Object.keys(groups).map( function( group )
  {
    return groups[group];
  })
};


sortDataByDate = function(data){
  data.sort(function(a,b) {return ((new Date(a.datetime) > new Date(b.datetime)) ? 1 : (new Date(b.datetime) > new Date(a.datetime)) ? -1 : 0);} );
};

sortDataByChannelID = function(data){
  data.sort(function(a,b) {return ((a.channelId > b.channelId) ? 1 : (a.channelId < b.channelId) ? -1 : 0);} );
};

module.exports = function(app) {
  var calibrationDatas = [];
  app.get('/v1/site/:id/data/', function(req, res) {

      calibrationModel.find({}).catch(function(err){
        console.log(err);
      }).
      then(function(datas){
        calibrationDatas = datas;
        //console.log(calibrationDatas);
      });

      var outputData  = [];
      var count = 0;
      var startDate = req.query.from;
      var endDate = req.query.to;
      var Limit = req.query.limit;
      if (Limit == undefined) Limit=50;
      else Limit = parseInt(req.query.limit);
      var channelID = req.params.id;
      var collectionNamesSite1=[siteModels.site1Model,siteModels.site2Model,siteModels.site3Model,siteModels.site4Model,siteModels.site5Model,siteModels.site6Model];
      var collectionNamesSite2=[siteModels.site8Model,siteModels.site9Model,siteModels.site10Model];
      var collection=[];
      if(parseInt(req.params.id)===1){
        collection=collectionNamesSite1;
      }
      else if(parseInt(req.params.id)===2){
        collection=collectionNamesSite2;
      }
      else{
        res.send("wrong site id");
      }

      var findQueryObj = {};
      if(startDate==undefined&&endDate!=undefined){
        todate = new Date(endDate);
        findQueryObj['serverDt'] ={$lte:todate};
      }
      else if(startDate!=undefined&&endDate==undefined){
        fromdate=new Date(startDate);
        findQueryObj['serverDt'] = {$qte:fromdate};
      }
      else if(startDate==undefined&&endDate==undefined){
        findQueryObj = {};
      }
      else{
        fromdate=new Date(startDate);
        todate = new Date(endDate);
        findQueryObj['serverDt']={$gte:startDate,$lte:endDate};
      }
      collection.forEach(function(model){
        model.find(findQueryObj).limit(Limit)
        .catch(function(err){
          console.log(err);
        })
        .then(function(datas){
          count=count+1;
          datas.forEach(function(data){
            data = data.toObject();
            var _date_ = new Date(data["serverDt"]);
            var calibData = calibrationDatas[data['devID']-1];
            data.temp1 = (data.temp1*Number(calibData.ffirstParam)+Number(calibData.fsecondParam)).toFixed(2);
            data.temp2 = (data.temp2*Number(calibData.lfirstParam)+Number(calibData.lsecondParam)).toFixed(2);
            var outtype = calibData.outputType;
            data.value=0
            //console.log(outtype)
            if(outtype=="min"){
              data.value = Math.min(data.temp1,data.temp2);
            }
            else if(outtype=="max"){
              data.value = Math.max(data.temp1,data.temp2);
            }
            else if(outtype=="mean"){
              data.value = ((Number(data.temp1)+Number(data.temp2))/2).toFixed(2);
            }
            _date_.setSeconds(0);
            _date_.setMilliseconds(0);
            delete data['serverDt'];
            delete data['nodeDt'];
            delete data['mCrc'];
            delete data['rssi'];
            delete data['tempC'];
            delete data['humdC'];
            delete data['_id'];
            delete data['temp1'];
            delete data['temp2'];
            data["datetime"]=_date_.toISOString();
            data["status"]=1;
            data["channelId"]=parseInt(data["devID"]);
            delete data["devID"];
            outputData.push(data);
          });
          if(count===collection.length){
            result = groupData(outputData,function(item){
              return item.datetime;
            });
            var mdata=[];
            //console.log(result);
            result.forEach(function(sample,i){
              //console.log(sample);
              var data={};
              data["datetime"]=sample[0]["datetime"].substring(0, 19);
              data["data"]=[];
              sample.forEach(function(s){
                delete s['datetime']
                data["data"].push(s);
              });
              sortDataByChannelID(data["data"]);
              mdata.push(data);
            });
            sortDataByDate(mdata);
            var returnObj={};
            returnObj["siteId"]=parseInt(req.params.id);
            returnObj["data"]=mdata;
            res.json(returnObj);
          }
      });
    });
  });
}
