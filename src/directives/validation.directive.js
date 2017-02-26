/* global angular */

'use strict';

/**
 * @ngdoc directive
 * @name bsValidation
 * @requires BsValidationService
*/
angular.module('bootstrap.angular.validation').directive('bsValidation', [
  '$timeout', '$injector', 'BsValidationService',
    function($timeout, $injector, validationService) {
      return {
          restrict: 'A',
          require: ['?ngModel', '?^^form'],
          link: function($scope, $element, $attr, controllers) {
            if (validationService.isValidationDisabled($element)) {
              return;
            }

            // Initialize controllers
            var ngModelController = controllers[0];
            var ngFormController = controllers[1];

            if (!ngModelController) {
              throw 'ng-model directive is required for the bs-validation directive to work.';
            }

            var $formGroupElement = validationService.getFormGroupElement($element);
            if (!$formGroupElement) {
              throw 'No parent form group element found for input element';
            }

            var displayValidationState = false;
            var shouldValidateOnBlur = validationService.shouldValidateOnBlur($element);
            var shouldValidateOnDisplay = validationService.shouldValidateOnDisplay($element);
            var shouldValidateOnSubmit = validationService.shouldValidateOnSubmit($element);

            var displayErrorAs = validationService.displayErrorPreference($element, $attr);
            var validationMessageService = validationService.getValidationMessageService(displayErrorAs);

            // Register generic custom validators if added to element
            angular.forEach(validationService.getValidators(), function(validator) {
              var key = validator.name;
              var attrValue = $element.attr(key);
              if ($attr[key] || (angular.isDefined(attrValue) && attrValue !== false)) {
                validationService.addValidator($scope, $element, $attr, ngModelController, validator);
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
              validationService.toggleErrorKeyClasses($formGroupElement, ngModelController.$error);

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
              return ngModelController.$error;
            }, displayOrHideValidationState, true);

            $scope.$on('onBsValidationStateChange', function(e, data) {
              displayValidationState = data.showValidationState;
              displayOrHideValidationState();
            });

            $scope.$on('$destroy', function() {
              validationMessageService.destroyMessage($element);
            });
            
            ngModelController.$showValidation = showValidation;
            ngModelController.$hideValidation = hideValidation;
          }
        };
    }
]);
