angular
.module('app')
.controller('tableCtrl', tableController)


tableController.$inject = ['$scope','$http','$state'];
function tableController($scope, $http, $state) {
  $scope.rowCollection=[];

  $scope.collectionCode=$state.params.channelCode;
  $scope.collectionName=$state.params.channelName;
  $http({
      url: '/api',
      data : {channel:$scope.collectionCode,count:50},
      method: "POST"
    })
  .then(function(response) {
    //console.log(response.data);
    $scope.rowCollection=response.data;
  });
}
