/* global angular */

/**
 * Created by shashank on 29/06/16.
 */

angular.module('bsValidationApp', ['ngRoute']);

angular.module('bsValidationApp')
  .config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {

      $routeProvider
        .when('/', {
          templateUrl: 'views/home.html'
        })

        .when('/phones/:phoneId', {
          template: '<phone-detail></phone-detail>'
        })

        .otherwise('/');
    }
  ]);