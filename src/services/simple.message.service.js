'use strict';

angular.module('bootstrap.angular.validation').factory('simpleMessageService', ['BsValidationService', function (validationService) {

  var errorElementClass = '.bs-invalid-msg';

  function getErrorContainer($element, $formGroupElement) {
    var $errorElement = $formGroupElement.find(errorElementClass);
    if ($errorElement && $errorElement.length) {
      return $errorElement;
    }

    var insertAfter;

    // Check if the container have any Bootstrap input group then append the error after it
    var groupElement = $formGroupElement.find('.input-group');
    if (groupElement.length > 0) {
      insertAfter = groupElement;
    } else {
      insertAfter = $element;
    }

    insertAfter.after('<span class="help-block ' + errorElementClass.substring(1) + '"></span>');
    return $formGroupElement.find(errorElementClass);
  }

  return {
    destroyMessage: function () {
      // Need not to do anything. Error elements will be automcatically removed on DOM unload
    },

    hideErrorMessage: function ($element, $formGroupElement) {
      validationService.removeErrorClass($formGroupElement);
      $formGroupElement.find(errorElementClass).addClass('ng-hide');
    },

    showErrorMessage: function ($element, $attr, ngModelController, $formGroupElement) {
      var message = validationService.getErrorMessage($element, $attr, ngModelController);

      var $errorElement = getErrorContainer($element, $formGroupElement);
      $errorElement.html(message).removeClass('ng-hide');
    }
  };
}]);
