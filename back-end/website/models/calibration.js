var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var calibrationSchema = new Schema({

    devId : {type : Number, default: 0},
    ffirstParam : {type : String, default :'0'},
    fsecondParam : {type : String, default:'0'},
    lfirstParam : {type : String, default:'0'},
    lsecondParam : {type : String, default:'0'},
    outputType : {type : String, default:'0'}
    
});


var calibrationModel = mongoose.model('calibrationModel', calibrationSchema,'calibs');

module.exports = calibrationModel;
