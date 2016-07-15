'use strict';

angular.module('bootstrap.angular.validation').factory('simpleMessageService', ['BsValidationService', function(bsValidationService) {

  var errorElementClass = '.bs-invalid-msg';
  var helpBlockClass = '.help-block';

  var errorClasses = [errorElementClass.substring(1), helpBlockClass.substring(1)];
  var markupClasses = errorClasses.join(' ');

  var iconMarkup = '<i class="fa fa-exclamation-triangle fa-fw"></i>';

  function errorContainer($element, $formGroupElement, message) {
    var insertAfter;

    // Check if the container have any Bootstrap input group then append the error after it
    var groupElement = $formGroupElement.findOne('.input-group');
    if (groupElement.length > 0) {
      insertAfter = groupElement;
    } else {
      insertAfter = $element;
    }

    message = '<span class="' + markupClasses + '">' + iconMarkup + message + '</span>';

    insertAfter.after(message);
  }

  return {
    hideErrorMessage: function($formGroupElement) {
      $formGroupElement.removeClass('has-error');
      $formGroupElement.findAll('span.' + errorClasses.join('.')).addClass('ng-hide');
    },

    resolveMessage: function($element, $attr, key) {
      return bsValidationService.resolveMessage($element, $attr, key);
    },

    showErrorMessage: function($element, $attr, ngModelController, $formGroupElement) {
      var firstErrorKey = Object.keys(ngModelController.$error)[0];
      var message = this.resolveMessage($element, $attr, firstErrorKey);

      var errorElement = $formGroupElement.findOne(errorElementClass);
      if (errorElement.length === 0) {
        errorContainer($element, $formGroupElement, message);
      }

      errorElement.html(iconMarkup + message).removeClass('ng-hide');
    }
  };
}]);
