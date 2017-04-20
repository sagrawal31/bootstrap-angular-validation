'use strict';

angular.module('bootstrap.angular.validation').factory('simpleMessageService', ['BsValidationService', function (validationService) {

  var errorElementClass = '.bs-invalid-msg';

  function getErrorContainer($element, $formGroupElement) {
    var $errorContainer;

    // If input element has "id" attribute
    if ($element.attr('id')) {
      // Then first try to find the error container with the same id prefixed with "bs-error-"
      $errorContainer = $formGroupElement.find('#bs-error-' + $element.attr('id'));
      if ($errorContainer && $errorContainer.length) {
        return $errorContainer;
      }
    }

    $errorContainer = $formGroupElement.find(errorElementClass);
    if ($errorContainer && $errorContainer.length) {
      return $errorContainer;
    }

    var insertAfter;

    // Check if the container have any Bootstrap input group then append the error after it
    var groupElement = $formGroupElement.find('.input-group');
    if (groupElement.length > 0) {
      insertAfter = groupElement;
    } else {
      insertAfter = $element;
    }

    var errorContainerHTML = '<span class="help-block ' + errorElementClass.substring(1) + '" ';
    if ($element.attr('id')) {
      errorContainerHTML += 'id="bs-error-' + $element.attr('id') + '"';
    }
    errorContainerHTML += '></span>';
    $errorContainer = angular.element(errorContainerHTML);

    insertAfter.after($errorContainer);
    return $errorContainer;
  }

  return {
    destroyMessage: function () {
      // Need not to do anything. Error elements will be automcatically removed on DOM unload
    },

    hideErrorMessage: function ($element, $formGroupElement) {
      validationService.removeErrorClass($formGroupElement);

      var $errorContainer = getErrorContainer($element, $formGroupElement);
      $errorContainer.html('').addClass('ng-hide');
    },

    showErrorMessage: function ($element, $attr, ngModelController, $formGroupElement) {
      var message = validationService.getErrorMessage($element, $attr, ngModelController);

      var $errorContainer = getErrorContainer($element, $formGroupElement);
      $errorContainer.html(message).removeClass('ng-hide');
    }
  };
}]);
