angular
.module('app')
.controller('tableCtrl', tableController)


tableController.$inject = ['$scope','$http','$state'];
function tableController($scope, $http, $state) {
  $scope.datas=[];

  var collectionName=$state.params.channelCode;
  $http({
          url: '/api',
          method: "POST",
          data: {'count':100,'site_id':collectionName,'start_':0,'end_':100}
  })
  .then(function(response) {
    $scope.datas=[];
    response.data.forEach(function(node) {
        var myDate =new Date(Number(node["serverDt"].substring(0, 4)), Number(node["serverDt"].substring(5, 7))-1,
          Number(node["serverDt"].substring(8, 10)), Number(node["serverDt"].substring(11, 13)),
          Number(node["serverDt"].substring(14, 16)), Number(node["serverDt"].substring(17, 19)));

        var temp_data  = node;
        temp_data.time = "";
        if (myDate.getHours() < 10)  temp_data.time = "0";
        temp_data.time = myDate.getHours() + ":";
        if (myDate.getMinutes() < 10) temp_data.time += "0";

        temp_data.time += "" + myDate.getMinutes();
        temp_data.date = "";
        if (myDate.getDate() < 10) temp_data.date = "0";
        temp_data.date += myDate.getDate() + "/";
        if (myDate.getMonth() < 10)   temp_data.date += "0";
        temp_data.date += (myDate.getMonth() + 1) + "/" + myDate.getFullYear();
        //console.log(temp_data);
        /*var nodecalibs = _calibs[Number(node["devID"])-1];
        temp_data.temp1 = (temp_data.temp1*Number(nodecalibs.ffirstParam)+Number(nodecalibs.fsecondParam)).toFixed(2);
        temp_data.temp2 = (temp_data.temp2*Number(nodecalibs.lfirstParam)+Number(nodecalibs.lsecondParam)).toFixed(2);
        var outtype = nodecalibs.outputType;
        temp_data.outTemp=0
        if(outtype=="min") temp_data.outTemp = Math.min(temp_data.temp1,temp_data.temp2);
        else if(outtype=="max") temp_data.outTemp = Math.max(temp_data.temp1,temp_data.temp2);
        else if(outtype=="mean") temp_data.outTemp = ((Number(temp_data.temp1)+Number(temp_data.temp2))/2).toFixed(2);*/

        $scope.datas.push(temp_data);
      });
    },
    function(error) { // optional
      // failed
      alert("Bir Sorun Oluştu..")
    });
}
