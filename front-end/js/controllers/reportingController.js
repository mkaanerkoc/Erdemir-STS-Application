angular
.module('app',['smart-table'])
.controller('reportingCtrl', reportingController)


reportingController.$inject = ['$scope','$http','$state'];
function reportingController($scope, $http, $state) {
  $scope.tableData=[];
  $scope.title = "Raporlama Ekranı";
  $scope.sites = [{name:"Kuzey Kollektörü",code:1},{name:"Güney Kollektörü",code:2}];
  $scope.channels = [];
  $scope.timeBases = [{name:"1 Dakika",minute:1},{name:"2 Dakika",minute:2},
                      {name:"5 Dakika",minute:5},{name:"10 Dakika",minute:10},
                      {name:"30 Dakika",minute:30},{name:"1 Saat",minute:60},
                      {name:"2 Saat",minute:120},{name:"3 Saat",minute:180},
                      {name:"6 Saat",minute:360},{name:"12 Saat",minute:720},{name:"24 Saat",minute:1440}];

  $scope.startDate = null;
  $scope.endDate = null;

  $scope.updateSites = function(code){
    var s = $scope.selectedField;
    //console.log("hello world update sites  "+s.name);
    if(s.code===2){
      $scope.channels = [{name:"50 Metre",code:[8]},{name:"75 Metre",code:[9]},
                          {name:"100 Metre",code:[10]},{name:"Tümü",code:[8,9,10]}];
    }
    else if(s.code===1){
      $scope.channels = [{name:"Su Alma Yapısı",code:[2]},{name:"0 Noktası",code:[3]},
                        {name:"50 Metre",code:[6]},{name:"75 Metre",code:[5]},{name:"100 Metre",code:[4]},
                        {name:"500 Metre",code:[1]},{name:"Tümü",code:[1,2,3,4,5,6]}];
    }

  }
  $scope.updateChannels = function(){
    var c = $scope.selectedChannel;
    //console.log("hello world update channels  "+c.name);
  }
  $scope.updateTimebase = function(){
    var c = $scope.selectedTimebase;
    //console.log("hello world update timebase  "+c.name);
  }
  $scope.showData = function(){
    if(valideInputs()){
      $http({
          url: '/report_demoo',
          data : {channel:$scope.selectedChannel.code,startdate:$scope.startDate,enddate : $scope.endDate,timeperiod:$scope.selectedTimebase.minute},
          method: "POST"
        })
      .then(function(response) {
          // success
        console.log(response.data);
        $scope.tableData=response.data;
      });
    }
    else{
      alert("Lütfen tüm bilgileri giriniz");
    }
  }
  $scope.exportToExcel = function(){
      if(valideInputs()){
        $http({
            url: '/excel_demo',
            data : {channel:$scope.selectedChannel.code,startdate:$scope.startDate,enddate : $scope.endDate,timeperiod:$scope.selectedTimebase.minute},
            method: "POST"
          })
        .then(function(response) {
            // success
          console.log(response.data);
          $scope.tableData=response.data;
        });
      }
      else{
        alert("Lütfen tüm bilgileri giriniz");
      }
  }
  valideInputs = function(){
    if($scope.selectedChannel==null||$scope.selectedTimebase==null||$scope.selectedField==null||$scope.startDate==null||$scope.endDate==null){
      return false;
    }
    else{
      return true;
    }
  }

}
