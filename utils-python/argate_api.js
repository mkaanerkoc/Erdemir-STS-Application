var express = require('express');
var app = express();
var url  = require('url');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;


var url = 'mongodb://localhost:27017/test-database';

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));



var server = app.listen(80, function() {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
});


app.get('/v1/site/all/',function(req,res){
  largerArray=[];
  var timeBase = 1;
  var limit  = 100;
  var meanPeriod = 1;
  var fromdate = req.query.from;
  var todate = req.query.to;

  if(req.query.timebase==undefined)
    timeBase=1;
  else
    timeBase = parseInt(req.query.timebase);

  if(req.query.limit==undefined)
    limit=1;
  else
    limit = parseInt(req.query.limit);


  if(req.query.meanPeriod==undefined)
    meanPeriod=1;
  else
    meanPeriod = parseInt(req.query.meanPeriod);


  var outputDatas = [];
//  getSiteData("1", fromdate,todate,limit,timeBase,res);
//  getSiteData("2", fromdate,todate,limit,timeBase,res);
//  getSiteData("3", fromdate,todate,limit,timeBase,res);
//  getSiteData("4", fromdate,todate,limit,timeBase,res);
//  getSiteData("5", fromdate,todate,limit,timeBase,res);
//  getSiteData("6", fromdate,todate,limit,timeBase,res);
  getSiteData("8", fromdate,todate,limit,timeBase,res);
  getSiteData("9", fromdate,todate,limit,timeBase,res);
  getSiteData("10",fromdate,todate,limit,timeBase,res);

});


app.get('/v1/site/:id/data',function(req,res){
  var timeBase = 1;
  var fromdate = new Date(req.query.from);
  var todate = new Date(req.query.to);
  var limit = parseInt(req.query.limit);
  if(req.query.timebase==undefined)
    timeBase=1;
  else
    timeBase = parseInt(req.query.timebase);
  var outputDatas = [];
  MongoClient.connect(url,function(err,db){
    if(err){
      res.send("Cannot connect database..!");
    }
    else{
      var collection_name= "posts.alldata";
      var clc_ = db.collection(collection_name);
      clc_.find({$and:[{'serverDt':{$gte:fromdate,$lte:todate}},{'devID': parseInt(req.params.id) }]}).sort({'serverDt':-1}).limit(limit).toArray(function(err,docs){
        console.log(docs);
        var len=docs.length;
        for(var i=0;i< len;i=i+timeBase ){
          outputDatas.push(docs[i]);
        }
        res.send(outputDatas);
      });
    }
  });
});


app.get('/v1/site/all/mean',function(req,res){
  largerArray=[];
  var timeBase = 1;
  var limit  = 100;
  var meanPeriod = 1;
  var fromdate = req.query.from;
  var todate = req.query.to;

  if(req.query.timebase==undefined)
    timeBase=1;
  else
    timeBase = parseInt(req.query.timebase);

  if(req.query.limit==undefined)
    limit=1;
  else
    limit = parseInt(req.query.limit);

  if(req.query.meanPeriod==undefined)
    meanPeriod=1;
  else
    meanPeriod = parseInt(req.query.meanPeriod);


  var outputDatas = [];
/*  getSiteDataMean("1", fromdate,todate,limit,meanPeriod,res);
  getSiteDataMean("2", fromdate,todate,limit,meanPeriod,res);
  getSiteDataMean("3", fromdate,todate,limit,meanPeriod,res);
  getSiteDataMean("4", fromdate,todate,limit,meanPeriod,res);
  getSiteDataMean("5", fromdate,todate,limit,meanPeriod,res);
  getSiteDataMean("6", fromdate,todate,limit,meanPeriod,res); */

  getSiteDataMean("8", fromdate,todate,limit,meanPeriod,res);
  getSiteDataMean("9", fromdate,todate,limit,meanPeriod,res);
  getSiteDataMean("10",fromdate,todate,limit,meanPeriod,res);

});
app.post('/v1/site/all/',function(req,res){
  largerArray=[];
  var timeBase = 1;
  var limit  = 100;
  var meanPeriod = 1;
  var fromdate = req.body.from;
  var todate = req.body.to;
  //console.log(req.body);
  if(req.body.timebase==undefined)
    timeBase=1;
  else
    timeBase = parseInt(req.body.timebase);

  if(req.body.limit==undefined)
    limit=1;
  else
    limit = parseInt(req.body.limit);


  if(req.body.meanPeriod==undefined)
    meanPeriod=1;
  else
    meanPeriod = parseInt(req.body.meanPeriod);
  var outputDatas = [];
  /*getSiteData("1", fromdate,todate,limit,timeBase,res);
  getSiteData("2", fromdate,todate,limit,timeBase,res);
  getSiteData("3", fromdate,todate,limit,timeBase,res);
  getSiteData("4", fromdate,todate,limit,timeBase,res);
  getSiteData("5", fromdate,todate,limit,timeBase,res);
  getSiteData("6", fromdate,todate,limit,timeBase,res);*/
  getSiteData("8", fromdate,todate,limit,timeBase,res);
  getSiteData("9", fromdate,todate,limit,timeBase,res);
  getSiteData("10",fromdate,todate,limit,timeBase,res);

});

app.post('/v1/site/all/mean',function(req,res){
  largerArray=[];
  var timeBase = 1;
  var limit  = 100;
  var meanPeriod = 1;
  //console.log(req.body);
  var fromdate = req.body.from;
  var todate = req.body.to;

  if(req.body.timebase==undefined)
    timeBase=1;
  else
    timeBase = parseInt(req.body.timebase);

  if(req.body.limit==undefined)
    limit=1;
  else
    limit = parseInt(req.body.limit);

  if(req.body.meanPeriod==undefined)
    meanPeriod=1;
  else
    meanPeriod = parseInt(req.body.meanPeriod);

  var outputDatas = [];
  /*getSiteDataMean("1", fromdate,todate,limit,meanPeriod,res);
  getSiteDataMean("2", fromdate,todate,limit,meanPeriod,res);
  getSiteDataMean("3", fromdate,todate,limit,meanPeriod,res);
  getSiteDataMean("4", fromdate,todate,limit,meanPeriod,res);
  getSiteDataMean("5", fromdate,todate,limit,meanPeriod,res);
  getSiteDataMean("6", fromdate,todate,limit,meanPeriod,res);*/
  getSiteDataMean("8", fromdate,todate,limit,meanPeriod,res);
  getSiteDataMean("9", fromdate,todate,limit,meanPeriod,res);
  getSiteDataMean("10",fromdate,todate,limit,meanPeriod,res);

});

getSiteData = function(siteID,startDate,endDate,limit,timeBase,res){
  var fromdate=new Date(startDate);
  var todate = new Date(endDate);
  var outputDatas = [];
  //console.log(fromdate);
  MongoClient.connect(url,function(err,db){

    if(err){
      res.send("Cannot connect database..!");
    }
    else{
      var collection_name= "posts.d"+siteID;
      var clc_ = db.collection(collection_name);
      clc_.find({"serverDt" : { $gt :fromdate, $lte:todate}}).sort({'serverDt':-1}).limit(limit).toArray(function(err,docs){
        //console.log(docs);
        var len=docs.length;
        for(var i=0;i< len;i=i+timeBase ){
	  delete docs[i]['nodeDt'];
	  delete docs[i]['_id'];
          outputDatas.push(docs[i]);
        }
        callbackFunction(siteID,outputDatas,res);
      });
    }
  });
}
getSiteDataMean = function(siteID,startDate,endDate,limit,meanPeriod,res){
  var fromdate=new Date(startDate);
  var todate = new Date(endDate);
  var outputDatas = [];
  MongoClient.connect(url,function(err,db){

    if(err){
      res.send("Cannot connect database..!");
    }
    else{
      var collection_name= "posts.d"+siteID;
      var clc_ = db.collection(collection_name);
      clc_.find({"serverDt" : { $gte :fromdate, $lte:todate}}).sort({'serverDt':-1}).toArray(function(err,docs){
        //console.log(docs);
        var len=docs.length;
        for(var i = 0 ; i < len ; i=(i+meanPeriod)){
          if((i+meanPeriod)<len){
            var meanValueRow=docs[i];
          //  console.log(docs[i]["temp1"]);
            var meanTemp1=0;
            var meanTemp2=0;
            var meanTempC=0;
            var meanHumdC=0;
            var meanRSSI=0;

            for(var j=i; j < (i+meanPeriod);j++){
              //console.log(docs[j]);
              meanTemp1+=docs[j]["temp1"];
              meanTemp2+=docs[j]["temp2"];
              meanTempC+=docs[j]["tempC"];
              meanHumdC+=docs[j]["humdC"];
              meanRSSI+=docs[j]["rssi"];
           }
            meanRSSI=Number((meanRSSI/meanPeriod).toFixed(2));
            meanTemp1=Number((meanTemp1/meanPeriod).toFixed(2));
            meanTemp2=Number((meanTemp2/meanPeriod).toFixed(2));
            meanTempC=Number((meanTempC/meanPeriod).toFixed(2));
            meanHumdC=Number((meanHumdC/meanPeriod).toFixed(2));
            meanValueRow["temp1"]=meanTemp1;
            meanValueRow["temp2"]=meanTemp2;
            meanValueRow["tempC"]=meanTempC;
            meanValueRow["humdC"]=meanHumdC;
            meanValueRow["rssi"]=meanRSSI;
            delete meanValueRow["nodeDt"];
	    delete meanValueRow["_id"];
            outputDatas.push(meanValueRow);
          }
        }
        callbackFunction(siteID,outputDatas,res);
      });
    }
  });
}
var largerArray=[];
callbackFunction = function(siteID,data,res){
  largerArray.push({'siteID':siteID,'data':data});
  //console.log(largerArray.length)
  if(largerArray.length==3){
    res.send(largerArray);
  }
}
