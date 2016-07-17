/* global document */

'use strict';

angular.module('bootstrap.angular.validation').factory('tooltipMessageService', ['$injector', 'BsValidationService',
'$interpolate', '$templateCache', 'bsValidationConfig',
function($injector, validationService, $interpolate, $templateCache, validationConfig) {

  function getElementID($element) {
    var id = $element.attr('id');
    if (id) {
      return id;
    }

    id = 'bs-' + (Math.floor(Math.random() * 10000)) + '-' + Math.floor(Math.random() * 10000);
    $element.attr('id', id);
    return id;
  }

  function getErrorTooltip($element) {
    var tooltipID = 'bs-error-' + getElementID($element);
    var tooltipElement = document.getElementById(tooltipID);

    if (tooltipElement) {
      return angular.element(tooltipElement);
    }

    var data = {errorClass: validationConfig.errorClass, tooltipID: tooltipID};
    var html = $templateCache.get('bav/template/tooltip.html');
    html = $interpolate(html)(data);

    if (validationConfig.tooltipAppendToBody) {
      angular.element(document.body).append(html);
    } else {
      $element.after(html);
    }

    return angular.element(document.getElementById(tooltipID));
  }

  function getTooltipPlacement($element) {
    var attributeName = 'bs-tooltip-placement';
    if ($element.attr(attributeName)) {
      return $element.attr(attributeName);
    }

    var parentForm = $element.parents('form');
    if (parentForm && parentForm.attr(attributeName)) {
      return parentForm.attr(attributeName);
    }

    // Use the global config
    return validationConfig.getTooltipPlacement();
  }

  return {
    hideErrorMessage: function($element, $formGroupElement) {
      validationService.removeErrorClass($formGroupElement);
      getErrorTooltip($element).removeClass('in');
    },

    showErrorMessage: function($element, $attr, ngModelController) {
      var message = validationService.getErrorMessage($element, $attr, ngModelController);
      var $errorTooltip = getErrorTooltip($element);
      var placement = getTooltipPlacement($element);
      var appendToBody = validationConfig.tooltipAppendToBody;

      $errorTooltip.find('.tooltip-inner').html(message);

      var $position = $injector.get('$uibPosition');
      var ttPosition = $position.positionElements($element, $errorTooltip, placement, appendToBody);
      $errorTooltip.css({ top: ttPosition.top + 'px', left: ttPosition.left + 'px' });
      $errorTooltip.addClass('in');

      if (!$errorTooltip.hasClass(ttPosition.placement.split('-')[0])) {
        $errorTooltip.addClass(ttPosition.placement.split('-')[0]);
      }

      $position.positionArrow($errorTooltip, ttPosition.placement);
    }
  };
}]);

angular.module('bootstrap.angular.validation').run(['$templateCache', function($templateCache) {
  $templateCache.put('bav/template/tooltip.html', '<div class="tooltip {{errorClass}}" id="{{tooltipID}}"' +
    ' role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>');
}]);
