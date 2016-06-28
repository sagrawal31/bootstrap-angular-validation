/* global document */

'use strict';

angular.module('bootstrap.angular.validation', []).config(['$httpProvider', function ($httpProvider) {
  var interceptor = ['$rootScope', 'BsValidationService', function ($rootScope, bsValidationService) {
    return {
      'response': function (response) {
        /**
         * Intercept all ng-included templates in a form and add validation-errors directive. See form
         * directive in this component itself.
         */
        if (bsValidationService.checkNgIncludedURL(response.config.url)) {
          /**
           * Empty 'div' is being used to temporarily store the received HTML from the server to find out
           * all the child form elements to add the 'bs-validation' directive. And then later the innerHTML
           * i.e. the received HTML can easily be extracted using the html() and the temporary 'div' will
           * be discarded.
           *
           * http://stackoverflow.com/a/652771/2405040
           */
          var parsedJQLiteElements = angular.element(document.createElement('div'));
          parsedJQLiteElements.append(response.data);
          bsValidationService.addDirective(parsedJQLiteElements);

          /*
           * Get the modified HTML template which is now having the 'bs-validation' directive.
           * (Not iterating over the every jQlite element otherwise it will append a string 'undefined'
           * for every new empty line in the HTML)
           */
          response.data = parsedJQLiteElements.html();
        }

        return response;
      }
    };
  }];

  $httpProvider.interceptors.push(interceptor);
}]);