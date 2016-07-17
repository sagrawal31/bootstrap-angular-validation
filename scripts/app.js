/* global angular */

angular.module('bsValidationApp', ['ngRoute']);

angular.module('bsValidationApp')
  .config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {

      $routeProvider
        .when('/', {
          templateUrl: 'views/home.html'
        })

        .when('/how-it-works', {
          templateUrl: 'views/how-it-works.html'
        })

        .when('/customization-and-examples', {
          templateUrl: 'views/customization.html'
        })

        .otherwise('/');
    }
  ]);

angular.module('bsValidationApp').directive('codepen', ['$interpolate', '$sce', function($interpolate, $sce) {
  return {
    restrict: 'E',
    replace: true,
    template: function() {
      return '<iframe height="{{::height}}" scrolling="no" src="{{::src}}" frameborder="no"' +
        ' allowtransparency="true" allowfullscreen="true" style="width: 100%;">See the Pen ' +
        '<a href="https://codepen.io/shashank-agrawal/pen/akEXbr/">Bootstrap + Angular Validation </a> ' +
        'by Shashank Agrawal (<a href="http://codepen.io/shashank-agrawal">@shashank-agrawal</a>) ' +
        'on <a href="http://codepen.io">CodePen</a>.</iframe>';
    },
    scope: true,
    link: function($scope, $element, $attr) {
      $scope.height = $attr.height || 300;
      $scope.themeId = $attr.themeId || 'default';
      $scope.penId = $attr.penId;
      $scope.defaultTab = $attr.defaultTab || 'result';

      var src = '//codepen.io/shashank-agrawal/embed/{{::penId}}/?height={{::height}}&theme-id={{::themeId}}&default-tab={{::defaultTab}}&embed-version=2';
      src = $interpolate(src)($scope);
      $scope.src = $sce.trustAsResourceUrl(src);
    }
  };
}]);