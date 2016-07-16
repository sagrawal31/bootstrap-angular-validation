/* global angular */

angular.module('bsValidationApp', ['ngRoute']);

angular.module('bsValidationApp')
  .config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {

      $routeProvider
        .when('/', {
          templateUrl: 'views/home.html'
        })

        .when('/docs', {
          templateUrl: 'views/documentations.html'
        })

        .otherwise('/');
    }
  ]);