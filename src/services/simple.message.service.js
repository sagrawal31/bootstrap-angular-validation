'use strict';

angular.module('bootstrap.angular.validation').factory('simpleMessageService', ['BsValidationService', 'bsValidationConfig',
function(validationService, validationConfig) {

  var errorElementClass = '.bs-invalid-msg';

  function errorContainer($element, $formGroupElement) {
    var $errorElement = $formGroupElement.findOne(errorElementClass);
    if ($errorElement && $errorElement.length) {
      return $errorElement;
    }

    var insertAfter;

    // Check if the container have any Bootstrap input group then append the error after it
    var groupElement = $formGroupElement.findOne('.input-group');
    if (groupElement.length > 0) {
      insertAfter = groupElement;
    } else {
      insertAfter = $element;
    }

    insertAfter.after('<span class="help-block ' + errorElementClass.substring(1) + '"></span>');
    return $formGroupElement.findOne(errorElementClass);
  }

  return {
    hideErrorMessage: function($element, $formGroupElement) {
      validationService.removeErrorClass($formGroupElement);
      $formGroupElement.findAll(errorElementClass).addClass('ng-hide');
    },

    resolveMessage: function($element, $attr, key) {
      return validationService.resolveMessage($element, $attr, key);
    },

    showErrorMessage: function($element, $attr, ngModelController, $formGroupElement) {
      var firstErrorKey = Object.keys(ngModelController.$error)[0];
      var message = validationConfig.getErrorMessagePrefix() + this.resolveMessage($element, $attr, firstErrorKey);

      var $errorElement = errorContainer($element, $formGroupElement);
      $errorElement.html(message).removeClass('ng-hide');
    }
  };
}]);
