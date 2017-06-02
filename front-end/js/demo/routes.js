angular
.module('app')
.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {
  $stateProvider
  .state('app.s1', {
    url: "/kuzey",
    abstract: true,
    template: '<ui-view></ui-view>',
    ncyBreadcrumb: {
      label: 'Kuzey Kollektörü'
    },
    resolve: {
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load controllers
        return $ocLazyLoad.load({
          files: ['js/controllers/tableController.js']
        });
      }]
    }
  })
  .state('app.s1.channel1', {
    url: '/',
    templateUrl: 'views/components/tables.html',
    ncyBreadcrumb: {
      label: '0 Noktası'
    },
    params :
      { channelCode:3 ,channelName:'Kuzey Kollektörü 0 Noktası'}
  })
  .state('app.s1.channel2', {
    url: '/',
    templateUrl: 'views/components/tables.html',
    ncyBreadcrumb: {
      label: 'Su Alma Yapısı'
    },
    params:{channelCode:2,channelName:'Kuzey Kollektörü Su Alma Yapısı'}
  })
  .state('app.s1.channel3', {
    url: '/',
    templateUrl: 'views/components/tables.html',
    ncyBreadcrumb: {
      label: '50 Metre'
    },
    params:{channelCode:6,channelName:'Kuzey Kollektörü 50. Metre'}
  })
  .state('app.s1.channel4', {
    url: '/',
    templateUrl: 'views/components/tables.html',
    ncyBreadcrumb: {
      label: '75 Metre'
    },
    params:{channelCode:5,channelName:'Kuzey Kollektörü 75. Metre'}
  })
  .state('app.s1.channel5', {
    url: '/',
    templateUrl: 'views/components/tables.html',
    ncyBreadcrumb: {
      label: '100 Metre'
    },
    params:{channelCode:4,channelName:'Kuzey Kollektörü 100. Metre'}
  })
  .state('app.s1.channel6', {
    url: '/',
    templateUrl: 'views/components/tables.html',
    ncyBreadcrumb: {
      label: '500 Metre'
    },
    params:{channelCode:1,channelName:'Kuzey Kollektörü 500. Metre'}
  })
  .state('app.s1.allchannels', {
    url: '/',
    templateUrl: 'views/components/tables.html',
    ncyBreadcrumb: {
      label: 'Kuzey Kollektörü'
    },
    params:{channelCode:91,channelName:'Kuzey Kollektörü'}
  })
  .state('app.s2', {
    url: "/guney",
    abstract: true,
    template: '<ui-view></ui-view>',
    ncyBreadcrumb: {
      label: 'Güney Kollektörü'
    },
    resolve: {
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load controllers
        return $ocLazyLoad.load({
          files: ['js/controllers/tableController.js']
        });
      }]
    }
  })
  .state('app.s2.channel1', {
    url: '/',
    templateUrl: 'views/components/tables.html',
    ncyBreadcrumb: {
      label: '50 Metre'
    },
    params:{channelCode:8,channelName:'Güney Kollektörü 50. Metre'}
  })
  .state('app.s2.channel2', {
    url: '/',
    templateUrl: 'views/components/tables.html',
    ncyBreadcrumb: {
      label: '75 Metre'
    },
    params:{channelCode:9,channelName:'Güney Kollektörü 75. Metre'}
  })
  .state('app.s2.channel3', {
    url: '/',
    templateUrl: 'views/components/tables.html',
    ncyBreadcrumb: {
      label: '100 Metre'
    },
    params:{channelCode:10,channelName:'Güney Kollektörü 100. Metre'}
  })
  .state('app.s2.allchannels', {
    url: '/',
    templateUrl: 'views/components/tables.html',
    ncyBreadcrumb: {
      label: 'Güney Kollektörü'
    },
    params:{channelCode:92,channelName:'Güney Kollektörü'}
  })
  .state('app.calibration', {
    url: '/calibration',
    templateUrl: 'views/components/calibration.html',
    ncyBreadcrumb: {
      label: 'Kalibrasyon Ekranı'
    },
    resolve: {
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load controllers
        return $ocLazyLoad.load({
          files: ['js/controllers/calibrationController.js']
        });
      }]
    }
  })
  .state('app.reporting', {
    url: '/reporting',
    templateUrl: 'views/components/reporting.html',
    ncyBreadcrumb: {
      label: 'Raporlama Ekranı'
    },
    resolve: {
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load controllers
        return $ocLazyLoad.load({
          files: ['js/controllers/reportingController.js']
        });
      }]
    }
  })
  .state('app.forms', {
    url: '/forms',
    templateUrl: 'views/forms.html',
    ncyBreadcrumb: {
      label: 'Forms'
    },
    resolve: {
      loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load([
          {
            serie: true,
            files: ['js/libs/moment.min.js']
          },
          {
            serie: true,
            files: ['js/libs/daterangepicker.min.js', 'js/libs/angular-daterangepicker.min.js']
          },
          {
            files: ['js/libs/mask.min.js']
          },
          {
            files: ['js/libs/select.min.js']
          }
        ]);
      }],
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load files for an existing module
        return $ocLazyLoad.load({
          files: ['js/controllers/forms.js']
        });
      }]
    }
  })
  .state('app.widgets', {
    url: '/widgets',
    templateUrl: 'views/widgets.html',
    ncyBreadcrumb: {
      label: 'Widgets'
    },
    resolve: {
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load controllers
        return $ocLazyLoad.load({
          files: ['js/controllers/widgets.js']
        });
      }]
    }
  })
  .state('app.charts', {
    url: '/charts',
    templateUrl: 'views/charts.html',
    ncyBreadcrumb: {
      label: 'Charts'
    },
    resolve: {
      // Plugins loaded before
      // loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
      //     return $ocLazyLoad.load([
      //         {
      //             serial: true,
      //             files: ['js/libs/Chart.min.js', 'js/libs/angular-chart.min.js']
      //         }
      //     ]);
      // }],
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load files for an existing module
        return $ocLazyLoad.load({
          files: ['js/controllers/charts.js']
        });
      }]
    }
  })
}]);
