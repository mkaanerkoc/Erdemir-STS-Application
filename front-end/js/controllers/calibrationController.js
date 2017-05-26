angular
.module('app')
.controller('calibrationCtrl', calibrationController)


calibrationController.$inject = ['$scope','$http','$state'];
function calibrationController($scope, $http, $state) {
  $scope.datas=[];
  $scope.title = "Kalibrasyon Menusu";
  $http({
      url: '/calibration',
      method: "POST"
    })
  .then(function(response) {
      // success
    $scope.calibDatas=[];
    //console.log(response.data);
    response.data.forEach(function(node){
        node["fieldName"]=idToName(node["devId"]);
        $scope.calibDatas.push(node);

    });
  });

}


idToName = function(_id){
  var siteName="";
  switch(_id){
    case 1:
      siteName="Kuzey Kollektörü 500 mt.";
      break;
    case 2:
      siteName="Su Alma Yapısı";
      break;
    case 3:
      siteName="Kuzey Kollektörü 0 noktası";
      break;
    case 4:
      siteName="Kuzey Kollektörü 100 mt.";
      break;
    case 5:
      siteName="Kuzey Kollektörü 75 mt.";
      break;
    case 6:
      siteName="Kuzey Kollektörü 50 mt.";
      break;
    case 7:
      siteName="";
      break;
    case 8:
      siteName="Güney Kollektörü 50 mt. ";
      break;
    case 9:
      siteName="Güney Kollektörü 75 mt. ";
      break;
    case 10:
      siteName="Güney Kollektörü 100 mt. ";
      break;
  }
  return siteName;
};
