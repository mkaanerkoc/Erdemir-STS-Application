angular
.module('app',['smart-table'])
.controller('mainCtrl', mainController)


mainController.$inject = ['$scope','$http','$state'];

function mainController($scope, $http, $state) {
  $scope.tableData=[];
  $scope.tableNames=[];

  $scope.fillMainPageData = function(){
    var date = new Date();
    var date2 = new Date();
    date.setHours(date.getHours()+3);
    date2.setHours(date.getHours());
    date.setMinutes(date.getMinutes()-10);
    date2.setMinutes(date.getMinutes()-60);
    //console.log(date2.toISOString()); //"2011-12-19T15:28:46.493Z"
    date2 = date2.toISOString();
    date = date.toISOString();
    var data_  = {channel:[1,2,3,4,5,6,8,9,10],startdate:date2 ,enddate : date,timeperiod:10,summary:false};
    console.log(data_);
//    var data_  = {'from':'2017-04-17T01:00:31.675Z','to':'2017-04-17T02:00:31.675Z','timebase':'1','limit':'10'};
    //console.log(data_);
    $http({
        url: '/reportV2',
        method: "POST",
        data: data_
      })
    .then(function(response){
      console.log(response);
      $scope.tableNames = response.data.cols.slice(2);
      $scope.tableData = response.data.rows;
    });
  };
  initMap();
  $scope.fillMainPageData();


}


function initMap() {
  //  var point1={lat:41.26946111111111,lng:31.421005555555556};
  var points = [
    /*{
      name: 'Site 1',
      lat: 41.260083333333334,
      lng: 31.398033333333334
    },*/
    {
      name: 'Güney Kollektörü 100. mt',
      lat: 41.25997777777778,
      lng: 31.402838888888887
    },
    {
      name: 'Güney Kollektörü 75. mt',
      lat: 41.259966666666664,
      lng: 31.40313611111111
    },
    {
      name: 'Güney Kollektörü 50. mt',
      lat: 41.25995833333333,
      lng: 31.40341388888889
    },
    {
      name: 'Kuzey Kollektörü 500. mt',
      lat: 41.26940277777778,
      lng: 31.41503611111111
    },
    {
      name: 'Kuzey Kollektörü 100. mt',
      lat: 41.26990277777778,
      lng: 31.419961111111114
    },
    {
      name: 'Kuzey Kollektörü 75. mt',
      lat: 41.26978333333333,
      lng: 31.42021388888889
    },
    {
      name: 'Kuzey Kollektörü 50. mt',
      lat: 41.269669444444446,
      lng: 31.42047777777778
    },
    {
      name: 'Kuzey Kollektörü 0 noktası',
      lat: 41.26946111111111,
      lng: 31.421005555555556
    },
    {
      name: 'Su Alma Yapısı',
      lat: 41.26787222222222,
      lng: 31.419155555555555
    }
  ];
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 41.265014,
      lng: 31.413233
    },
    zoom: 15,
    mapTypeId: 'satellite'
  });
  var infowindow = new google.maps.InfoWindow();
  var marker, i;

  for (i = 0; i < points.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(points[i]['lat'], points[i]['lng']),
      map: map
    });
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        infowindow.setContent(points[i]['name']);
        infowindow.open(map, marker);
      }
    })(marker, i));
  }
}
