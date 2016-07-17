/* global angular */

'use strict';

/**
 * @ngdoc directive
 * @name bsValidation
 * @requires BsValidationService
*/
angular.module('bootstrap.angular.validation').directive('bsValidation', [
  '$timeout', '$injector', 'BsValidationService', 'bsValidationConfig',

    function($timeout, $injector, validationService, validationConfig) {
      return {
          restrict: 'A',
          require: ['ngModel', '?^^form'],
          link: function($scope, $element, $attr, controllers) {
            // initialize controllers
            var ngModelController = controllers[0];
            var ngFormController = controllers[1];

            var $formGroupElement = validationService.getFormGroupElement($element);
            if (!$formGroupElement) {
              throw 'No parent form group element found for input element';
            }

            var displayValidationState = false;
            var shouldValidateOnBlur = validationConfig.shouldValidateOnBlur();
            var shouldValidateOnDisplay = validationConfig.shouldValidateOnDisplay();
            var shouldValidateOnSubmit = validationConfig.shouldValidateOnSubmit();

            var displayErrorAs = validationService.displayErrorPreference($element, $attr);
            var validationMessageService = validationService.getValidationMessageService(displayErrorAs);

            // Register generic custom validators if added to element
            angular.forEach(validationService.getValidators(), function(key) {
              var attrValue = $element.attr(key);
              if ($attr[key] || (angular.isDefined(attrValue) && attrValue !== false)) {
                validationService.addValidator($scope, $attr, ngModelController, key);
              }
            });

            function addErrorClass() {
              validationService.addErrorClass($formGroupElement);
            }

            function removeSuccessClass() {
              validationService.removeSuccessClass($formGroupElement);
            }

            function displayError() {
              addErrorClass();
              validationMessageService.showErrorMessage($element, $attr, ngModelController, $formGroupElement);
            }

            function hideError() {
              validationMessageService.hideErrorMessage($element, $formGroupElement);
            }

            function addSuccessClass() {
              validationService.addSuccessClass($formGroupElement);
              return hideError();
            }

            function displaySuccess() {
              addSuccessClass();
            }

            function hideSuccess() {
              removeSuccessClass();
            }

            function displayOrHideValidationState() {
              if (!displayValidationState) {
                hideSuccess();
                return hideError();
              }

              if (ngModelController.$valid) { return displaySuccess(); }
              if (ngModelController.$invalid) { return displayError(); }
            }

            function showValidation() {
              displayValidationState = true;
              displayOrHideValidationState();
            }

            function hideValidation() {
              displayValidationState = false;
              displayOrHideValidationState();
            }

            if (shouldValidateOnBlur) {
              var dewatcher = $scope.$watch(function() {
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

            if (shouldValidateOnDisplay) {
              showValidation();
            }

            // TODO Find alternative for this watch
            $scope.$watch(function() {
              return ngModelController.$viewValue + ngModelController.$modelValue;
            }, displayOrHideValidationState);

            $scope.$on('onBsValidationStateChange', function(e, data) {
              displayValidationState = data.showValidationState;
              displayOrHideValidationState();
            });
            
            ngModelController.$showValidation = showValidation;
            ngModelController.$hideValidation = hideValidation;
          }
        };
    }
]);
