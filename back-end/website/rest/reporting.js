var rawLogSchema = require('../models/rawlogmodel.js').rawLogSchema;
var calibrationModel = require('../models/calibration.js');
var mongoose = require('mongoose');
var moment = require('moment-timezone');
var xl = require('excel4node');
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

    app.post('/excel_demo',function(req,res){
        console.log("excel requested");
        var responseData={};
        var channelIDs = req.body.channel.map(function(e){return {'devID':e};});
        var timePeriod = parseInt(req.body.timeperiod);
        var startDate = moment.tz(req.body.startdate, "YYYY/MM/DD HH:mm", "Europe/Istanbul").toDate();
        var endDate   = moment.tz(req.body.enddate,   "YYYY/MM/DD HH:mm", "Europe/Istanbul").toDate();
        //var groupByTime = req.body.summary;
        var groupByTime = true;
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
        //TODO: buradaki sort query'sini mongodb api'ine yaptırmak yerine nodejs de yaptırmak daha mantıklı olabilir.
        calibrationModel.find({}).then(function(calibdata)
        {
            var siteModel = mongoose.model('siteModel', rawLogSchema,'posts.alldata');
            siteModel.find(betweenDatesQuery).sort({serverDt: -1}).then(function(data)
            {
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
                channelDataArray.forEach(function(data,i)
                {
                    var nodecalibs=calibdata.filter(function(cc){return cc['devId'] == data[0].devID;})[0];
                    data.map(function(td)
                    {
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
                    while(a.length)
                    {
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
                    if(true==groupByTime)
                    {
                      responseData.rows = groupBy(responseData.datas,function(item){return [item.time,item.date]});
                    }
                    else
                    {
                      responseData.rows = groupBy(responseData.datas,function(item){return [item.devID]});
                    }
                });
                delete responseData.datas;
                //TODO: Excel e cikarma fonksiyonlari buraya gelecek.
                // Create a new instance of a Workbook class
                var wb = new xl.Workbook();
                // Add Worksheets to the workbook
                var ws = wb.addWorksheet('Sheet 1');
                var headerStyle = wb.createStyle({
                    font: {
                        color: '#000000',
                        size: 16,
                        bold: true
                    },
                    alignment: {
                        wrapText: true,
                        horizontal: 'center'
                    },
                    numberFormat: '$#,##0.00; ($#,##0.00); -'
                });
                var rowStyle = wb.createStyle({
                  font: {
                      color: '#121212',
                      size: 12
                  },
                  alignment: {
                      wrapText: true,
                      horizontal: 'center'
                  }
                });
                //Write Headers first
                responseData.cols.forEach(function(i,index){
                    ws.cell(1,index+1).string(i).style(headerStyle);
                    ws.column(index+1).setWidth(i.length*2);
                    ws.row(1).setHeight(25);
                });
                ws.column(1).setWidth(20);
                ws.column(2).setWidth(20);
                //Write Row Datas. There is two loop inside each other
                responseData.rows.forEach(function(i,index1){
                    //console.log(i);
                    ws.cell(index1+2,1).string(i[0]["date"]).style(rowStyle);
                    ws.cell(index1+2,2).string(i[0]["time"]).style(rowStyle);
                    i.forEach(function(j,index2){
                        //console.log(j["outTemp"]);
                        ws.cell(index1+2,index2+3).number(j["outTemp"]).style(rowStyle);
                    });
                });
                wb.write(__dirname + '/temperature-report.xlsx');
                //TODO: response olarak dosyanin donmesi gerekiyor.
                res.send("okey");
        });
      });
  });

  app.get('/excel_demo',function(req,res){
    var file = __dirname + '/temperature-report.xlsx';
    //console.log(file);
    res.setHeader('Content-disposition', 'attachment; filename=temperature-report.xlsx');
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.download(file);
  });
  app.post('/report', function(req, res) {

  });
  var calibrationDatas = [];
  app.post('/summary_data', function(req, res) {


  });



  app.post('/reportV2', function(req, res) {
    var responseData={};
    var channelIDs = req.body.channel.map(function(e){return {'devID':e};});
    var timePeriod = parseInt(req.body.timeperiod);
    var startDate = moment.tz(req.body.startdate, "YYYY/MM/DD HH:mm", "Europe/Istanbul").toDate();
    var endDate   = moment.tz(req.body.enddate,   "YYYY/MM/DD HH:mm", "Europe/Istanbul").toDate();
    var groupByTime = req.body.summary;

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
    //console.log(startDate);
  //  console.log(endDate);
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

          data.map(function(td)
          {
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
          while(a.length)
          {
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
          if(true==groupByTime)
          {
            responseData.rows = groupBy(responseData.datas,function(item){return [item.time,item.date]});
          }
          else
          {
            responseData.rows = groupBy(responseData.datas,function(item){return [item.devID]});
          }
        });
        delete responseData.datas;
        res.json(responseData);
      });
    });
  });
}
