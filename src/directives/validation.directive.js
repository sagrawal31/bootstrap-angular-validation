/* global angular */

'use strict';

/**
 * @ngdoc directive
 * @name bsValidation
 * @requires $interpolate
 * @requires BsValidationService
 * @description
 * This directive must be applied to every input element on which we need to use custom validations like jQuery.
 * Those element must have ng-model attributes. This directive will automatically add the 'has-error' class on the
 * parent element with class '.form-group' and will show/hide the validation message automatically.
*/
angular.module('bootstrap.angular.validation').directive('bsValidation', [
  '$interpolate', '$timeout', '$injector', 'BsValidationService', 'bsValidationConfig',

    function($interpolate, $timeout, $injector, bsValidationService, bsValidationConfig) {
      return {
          restrict: 'A',
          require: ['ngModel', '?^^form'],
          link: function($scope, $element, $attr, controllers) {
            // initialize controllers
            var ngModelController = controllers[0];
            var ngFormController = controllers[1];

            // HTML selector helper
            var errorElementClass = 'bs-invalid-msg';

            var helpBlock = 'help-block';

            // All classed needed to add to validation message
            var errorClasses = [errorElementClass, helpBlock];

            var $formGroupElement = bsValidationService.getFormGroupElement($element);
            if (!$formGroupElement) {
              throw 'No parent form group element found for input element';
            }

            var displayValidationState = false;
            var shouldValidateOnBlur = bsValidationConfig.shouldValidateOnBlur();
            var shouldValidateOnDisplay = bsValidationConfig.shouldValidateOnDisplay();
            var shouldValidateOnSubmit = bsValidationConfig.shouldValidateOnSubmit();

            var metaInformation = bsValidationService.getMetaInformation($element);
            var displayErrorAs = bsValidationService.displayErrorPreference($element, $attr);
            var validationMessageService = bsValidationService.getValidationMessageService(displayErrorAs);

            // Register generic custom validators if added to element
            angular.forEach(bsValidationService.getValidators(), function(key) {
              var attrValue = $element.attr(key);
              if ($attr[key] || (angular.isDefined(attrValue) && attrValue !== false)) {
                bsValidationService.addValidator($scope, $attr, ngModelController, key, metaInformation);
              }
            });

            function removeErrors() {
              validationMessageService.hideErrorMessage($formGroupElement);
            }

            function removeSuccessClass() {
              $formGroupElement.removeClass('has-success');
            }

            function addErrors() {
              bsValidationService.addErrorClass($formGroupElement);
              validationMessageService.showErrorMessage($element, $attr, ngModelController, $formGroupElement);
              return false;
            }

            function addSuccessClass() {
              $formGroupElement.addClass('has-success');
              return removeErrors();
            }

            function displayOrHideValidationState() {
              if (!displayValidationState) {
                removeSuccessClass();
                removeErrors();
              }

              if (ngModelController.$valid) { return addSuccessClass(); }
              if (ngModelController.$invalid) { return addErrors(); }
            }

            if (shouldValidateOnDisplay) {
              displayValidationState = true;
              ngModelController.$validate();

              $timeout(function() {
                // TODO Figure out why do we require $timeout here
                displayOrHideValidationState();
              });
            }

            if (shouldValidateOnBlur) {
              var dewatcher = $scope.$watch(function () {
                return ngModelController.$touched;
              }, function(lostFocus) {
                if (lostFocus) {
                  displayValidationState = true;
                  displayOrHideValidationState();
                  dewatcher();
                }
              });
            }

            if (shouldValidateOnSubmit && ngFormController) {
              // register watchers for submission touch and valid
              $scope.$watch(function() {
                return ngFormController.$submitted;
              }, function(submitted) {
                displayValidationState = submitted;
                displayOrHideValidationState();
              });
            }

            ngModelController.$viewChangeListeners.push(function() {
              displayOrHideValidationState();
            });
          }
        };
    }
]);
