'use strict';

(function () {
  var directiveFunction = ['bsValidationDirective', function (bsValidationDirective) {
    return {
      restrict: 'E',
      require: ['?ngModel', '?^^form'],
      compile: function ($element, $attr) {
        // Do not add validation directive if an attribute "bs-no-validation" is present
        if ($attr.hasOwnProperty('bsNoValidation')) {
          return;
        }

        // Do not add validation directive if the directive "ng-model" is not present
        if (!$attr.hasOwnProperty('ngModel')) {
          return;
        }

        // Do not add validation directive if the directive is already present
        if ($attr.hasOwnProperty('bsValidation')) {
          return;
        }

        // Add the validation directive
        $element.attr('bs-validation', '');

        // Return the linking function of the "bsValidation" directive from here so that we don't have to duplicate it
        return bsValidationDirective[0].link;
      }
    };
  }];

  /**
   * @ngdoc directive
   * @name input, select, textarea
   * @description There are situations where we add some form elements dynamically either using some directive or
   * using "ng-include" then the validation directive won't work automatically and we have to manually add the
   * "bs-validation" directive manually on them.
   *
   * Adding below these directive will fix the above stated problem.
   */
  angular.module('bootstrap.angular.validation')
    .directive('input', directiveFunction)
    .directive('select', directiveFunction)
    .directive('textarea', directiveFunction);
})();