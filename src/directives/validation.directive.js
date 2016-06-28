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
  '$interpolate', '$timeout', 'BsValidationService', 'bsValidationConfig',

    function($interpolate, $timeout, bsValidationService, bsValidationConfig) {
      return {
          restrict: 'A',
          require: ['ngModel', '?^^form'],
          link: function($scope, $element, $attr, controllers) {
            // initialize controllers
            var ngModelController = controllers[0];
            var ngFormController = controllers[1];

            // HTML selector helper
            var errorElementClass = 'bs-invalid-msg';
            var iconMarkup = '<i class="fa fa-exclamation-triangle fa-fw"></i>';
            var formGroup = '.form-group';
            var customFormGroup = '[bs-form-group]';
            var helpBlock = 'help-block';

            // All classed needed to add to validation message
            var errorClasses = [errorElementClass, helpBlock];
            var markupClasses = errorClasses.join(' ');

            // Search parent element with class form-group to operate on.
            var formGroupElement = $element.parents(formGroup);

            // Search for an attribute 'bs-form-group' if the class '.form-group' is not available
            if (!formGroupElement || formGroupElement.length === 0) {
              formGroupElement = $element.parents(customFormGroup);

              // If we still don't find any element
              if (!formGroupElement || formGroupElement.length === 0) {
                // Then do not execute the directive at all
                return;
              }
            }

            var displayValidationState = false;
            var shouldValidateOnBlur = bsValidationConfig.shouldValidateOnBlur();
            var shouldValidateOnDisplay = bsValidationConfig.shouldValidateOnDisplay();
            var shouldValidateOnSubmit = bsValidationConfig.shouldValidateOnSubmit();

            var metaInformation = {};
            angular.forEach(bsValidationService.getMeta(), function(key) {
              metaInformation[key] = $element.attr(key);
            });

            // Register generic custom validators if added to element
            angular.forEach(bsValidationService.getValidators(), function(key) {
              var attrValue = $element.attr(key);
              if ($attr[key] || (angular.isDefined(attrValue) && attrValue !== false)) {
                bsValidationService.addValidator($scope, $attr, ngModelController, key, metaInformation);
              }
            });

            function resolveMessage(key) {
              var message = $element.attr(key + '-notification') || bsValidationService.getDefaultMessage(key);
              var matchers = angular.extend({}, {validValue: $attr[key]}, metaInformation);
              return $interpolate(message)(matchers);
            }

            function removeErrors() {
              formGroupElement.removeClass('has-error');
              if (formGroupElement.length > 0) { formGroupElement.findAll('span.' + errorClasses.join('.')).addClass('ng-hide'); }
              return false;
            }

            function removeSuccessClass() {
              formGroupElement.removeClass('has-success');
            }

            function addErrors() {
              addErrorClass();
              addErrorMessage();
              return false;
            }

            function addSuccessClass() {
              formGroupElement.addClass('has-success');
              return removeErrors();
            }

            function addErrorClass() {
              formGroupElement.removeClass('has-success');
              formGroupElement.addClass('has-error');
            }

            function renderError(message) {
              return '<span class="' + markupClasses + '">' + iconMarkup + message + '</span>';
            }

            function errorContainer(message) {
              var insertAfter = $element;
              // Check if the container have any Bootstrap input group then append the error after it
              var groupElement = formGroupElement.findOne('.input-group');
              if (groupElement.length > 0) {
                  insertAfter = groupElement;
              }
              insertAfter.after(renderError(message));
            }

            function addErrorMessage() {
              var message = resolveMessage(Object.keys(ngModelController.$error)[0]);
              var errorElement = formGroupElement.findOne('.' + errorElementClass);
              if (errorElement.length === 0) { errorContainer(message); }
              errorElement.html(iconMarkup + message).removeClass('ng-hide');
            }

            function displayOrHideValidationState() {
              if (!displayValidationState) {
                removeSuccessClass();
                return removeErrors();
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
              $scope.$watchCollection(function() {
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
