var mongoose = require('mongoose');

var calibrationSchema = new Schema({
    name : {type : String, default: ''},
    serverDt : {type : Date,default :''},
    temp1 : {type : Number, default:0},
    temp2 : {type : Number, default:0},
    tempC : {type : Number, default:0},
    humdC : {type : Number, default:0}
});


var calibrationModel = mongoose.model('calibrationModel', calibrationSchema,'calibs');

module.exports = calibrationModel;
