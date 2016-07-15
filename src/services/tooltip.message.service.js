/* global document */

'use strict';

angular.module('bootstrap.angular.validation').factory('tooltipMessageService', ['$uibPosition', 'BsValidationService',
function($uibPosition, validationService) {

  var iconMarkup = '<i class="fa fa-exclamation-triangle fa-fw"></i>';

  function getElementID($element) {
    var id = $element.attr('id');

    if (id) {
      return id;
    }

    id = 'bs-' + (Math.floor(Math.random() * 10000)) + '-' + Math.floor(Math.random() * 10000);
    $element.attr('id', id);
    return id;
  }

  function getErrorTooltipID($element) {
    return 'bs-error-' + getElementID($element);
  }

  function getErrorTooltip($element) {
    var tooltipID = getErrorTooltipID($element);
    return angular.element(document.getElementById(tooltipID));
  }

  return {
    hideErrorMessage: function($element, $formGroupElement) {
      validationService.removeErrorClass($formGroupElement);
      getErrorTooltip($element).removeClass('in');
    },

    resolveMessage: function($element, $attr, key) {
      return validationService.resolveMessage($element, $attr, key);
    },

    showErrorMessage: function($element, $attr, ngModelController, $formGroupElement) {
      var firstErrorKey = Object.keys(ngModelController.$error)[0];
      var message = this.resolveMessage($element, $attr, firstErrorKey);

      var tooltipID = getErrorTooltipID($element);
      var $errorTooltip = getErrorTooltip($element);

      if (!$errorTooltip || !$errorTooltip.length) {
        angular.element('body').append('<div class="tooltip has-error" id="' + tooltipID + '" role="tooltip"' +
          '><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>');

        $errorTooltip = getErrorTooltip($element);
      }

      var ttPosition = $uibPosition.positionElements($element, $errorTooltip, 'bottom-left', true);
      $errorTooltip.css({ top: ttPosition.top + 'px', left: ttPosition.left + 'px' });
      $errorTooltip.findOne('.tooltip-inner').html(message);
      $errorTooltip.addClass('in').addClass(ttPosition.placement);
    }
  };
}]);
