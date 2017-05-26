var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var rawLogSchema = new Schema({
  devID: {type : String, default: ''},
  serverDt : {type : Date},
  nodeDt : {type : String,default :''},
  temp1    : {type : Number, default:0},
  temp2    : {type : Number, default:0},
  tempC    : {type : Number, default:0},
  humdC    : {type : Number, default:0},
  rssi     : {type : Number, default:0},
  mCrc     : {type : Number, default:0}
});


// the schema is useless so far
// we need to create a model using it
var site1Model = mongoose.model('site1Model', rawLogSchema,'posts.d1');
var site2Model = mongoose.model('site2Model', rawLogSchema,'posts.d2');
var site3Model = mongoose.model('site3Model', rawLogSchema,'posts.d3');
var site4Model = mongoose.model('site4Model', rawLogSchema,'posts.d4');
var site5Model = mongoose.model('site5Model', rawLogSchema,'posts.d5');
var site6Model = mongoose.model('site6Model', rawLogSchema,'posts.d6');
var site8Model = mongoose.model('site8Model', rawLogSchema,'posts.d8');
var site9Model = mongoose.model('site9Model', rawLogSchema,'posts.d9');
var site10Model = mongoose.model('site10Model', rawLogSchema,'posts.d10');

// make this available to our users in our Node applications
module.exports = {
  rawLogSchema,
  site1Model,
  site2Model,
  site3Model,
  site4Model,
  site5Model,
  site6Model,
  site8Model,
  site9Model,
  site10Model
}
