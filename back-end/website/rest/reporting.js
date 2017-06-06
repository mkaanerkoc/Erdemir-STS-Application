var rawLogSchema = require('../models/rawlogmodel.js').rawLogSchema;
var calibrationModel = require('../models/calibration.js');
var mongoose = require('mongoose');
var moment = require('moment-timezone');
var excelHandler = require('xlsx');
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
function Workbook() {
  if(!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

function datenum(v, date1904) {
	if(date1904) v+=1462;
	var epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';

			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}

module.exports = function(app) {
  var calibrationDatas = [];

  app.post('/excel_demo',function(req,res){
    var data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]
    var ws_name = "SheetJS";

    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "test.xlsx")


    var wb = new Workbook()
    ws = sheet_from_array_of_arrays(data);

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
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
          if(true==groupByTime){
            responseData.rows = groupBy(responseData.datas,function(item){return [item.time,item.date]});
          }
          else {
            responseData.rows = groupBy(responseData.datas,function(item){return [item.devID]});
          }
        });
        delete responseData.datas;
        res.json(responseData);
      });
    });
  });
}
