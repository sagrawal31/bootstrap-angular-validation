'use strict';

/**
 * @ngcode service
 * @name BsValidationService
 * @description Core service of this module to provide various default validations.
 */
angular.module('bootstrap.angular.validation').factory('BsValidationService', ['$interpolate', 'bsValidationConfig',
'$injector', function($interpolate, validationConfig, $injector) {

  var displayErrorAsAttrName = 'bsDisplayErrorAs';
  var customFormGroup = '[bs-form-group]';
  var formGroupClass = '.form-group';

  var messages = {
    required: 'This field is required.',
    email: 'Please enter a valid email address.',
    strictemail: 'Please enter a valid email address.',
    url: 'Please enter a valid URL.',
    number: 'Please enter a valid number.',
    digits: 'Please enter only digits.',
    min: 'Please enter a value greater than or equal to {{validValue}}.',
    max: 'Please enter a value less than or equal to {{validValue}}.',
    length: 'Please enter all {{validValue}} characters.',
    minlength: 'Please enter at least {{validValue}} characters.',
    maxlength: 'Please enter no more than {{validValue}} characters.',
    editable: 'Please select a value from dropdown.',
    pattern: 'Please fix the pattern.',
    equalto: 'must match {{matchName}}.'
  };

  var ngIncludedURLs = [];

  var genericValidators = {
    digits: function (value) {
      return (/^\d+$/).test(value);
    },
    equalto: function (value, $scope, attr) {
      return value + '' === attr.equalto + '';
    },
    number: function (value) {
      return (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/).test(value);
    },
    min: function (value, $scope, attr) {
      return parseFloat(value) >= parseFloat(attr.min);
    },
    max: function (value, $scope, attr) {
      return parseFloat(value) <= parseFloat(attr.max);
    },
    length: function (value, $scope, attr) {
      return value.length === parseInt(attr.length);
    },
    strictemail: function (value) {
      return new RegExp(/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/).test(value);
    }
  };

  var selectors = [];
  var elements = ['input', 'select', 'textarea'];

  angular.forEach(elements, function (element) {
    selectors.push(element + '[ng-model]');
    selectors.push(element + '[data-ng-model]');
  });

  var selector = selectors.join(',');

  return {
    /**
     * Search all the input element inside the given DOM element and apply the 'bs-validation' directive so we
     * need not a add it for every form element.
     */
    getValidators: function () {
      var builtIn = ['equalto', 'min', 'max', 'number', 'digits', 'length'];
      var additional = Object.keys(genericValidators);
      return builtIn.concat(additional);
    },

    getMeta: function () {
      return ['matchName'];
    },

    getMetaInformation: function($element) {
      var metaInformation = {};

      angular.forEach(this.getMeta(), function(key) {
        metaInformation[key] = $element.attr(key);
      });

      return metaInformation;
    },

    addDirective: function ($element) {
      var validateableElements = $element.findAll(selector);
      validateableElements.attr('bs-validation', '');
      return validateableElements;
    },

    addErrorClass: function($formGroupElement) {
      this.removeErrorClass($formGroupElement);
      $formGroupElement.addClass(validationConfig.errorClass);
    },

    addSuccessClass: function($formGroupElement) {
      this.removeErrorClass($formGroupElement);

      if (validationConfig.shouldAddSuccessClass()) {
        $formGroupElement.addClass(validationConfig.successClass);
      }
    },

    addToNgIncludedURLs: function (url) {
      if (ngIncludedURLs.indexOf(url) === -1) {
        ngIncludedURLs.push(url);
      }
    },

    addValidator: function ($scope, $attr, ngModelController, validatorKey) {
      ngModelController.$validators[validatorKey] = function (modelValue, viewValue) {
        var value = modelValue || viewValue;
        return ngModelController.$isEmpty(value) || genericValidators[validatorKey](value, $scope, $attr);
      };
    },

    checkNgIncludedURL: function (url) {
      var index = ngIncludedURLs.indexOf(url);
      if (index > -1) {
        ngIncludedURLs.splice(index, 1);
        return true;
      }

      return false;
    },

    displayErrorPreference: function($element, $attr) {
      var attrName = displayErrorAsAttrName;
      if ($attr[attrName]) {
        return $attr[attrName];
      } else {
        var $parentForm = $element.parents('form');

        // .attr() method not accepting camelCase version of the attribute name. Converting it to dashed-case
        attrName = attrName.replace(/([A-Z])/g, function($1) {
          return '-' + $1.toLowerCase();
        });

        if ($parentForm && $parentForm.attr(attrName)) {
          return $parentForm.attr(attrName);
        }
      }

      // Use the global preference
      return validationConfig.getDisplayErrorsAs();
    },

    getDefaultMessage: function (key) {
      return messages[key];
    },

    getErrorMessage: function($element, $attr, ngModelController) {
      var firstErrorKey = Object.keys(ngModelController.$error)[0];
      return validationConfig.getErrorMessagePrefix() + this.resolveMessage($element, $attr, firstErrorKey);
    },

    getFormGroupElement: function($element) {
      // Search parent element with class form-group to operate on.
      var formGroupElement = $element.parents(formGroupClass);

      // Search for an attribute 'bs-form-group' if the class '.form-group' is not available
      if (!formGroupElement || formGroupElement.length === 0) {
        formGroupElement = $element.parents(customFormGroup);

        if (!formGroupElement || formGroupElement.length === 0) {
          return null;
        }
      }

      return formGroupElement;
    },

    getValidationMessageService: function(displayType) {
      var validationMessageService;

      try {
        validationMessageService = $injector.get(displayType + 'MessageService');
      } catch(e) {
        throw 'No message service found for type [' + displayType + '].';
      }

      if (displayType === 'tooltip' && !$injector.has('$uibPosition')) {
        throw '$uibPosition service required from the ui-bootstrap module in order to use the tooltip message.';
      }

      return validationMessageService;
    },

    removeErrorClass: function($formGroupElement) {
      $formGroupElement.removeClass(validationConfig.errorClass);
    },

    removeSuccessClass: function($formGroupElement) {
      $formGroupElement.removeClass(validationConfig.successClass);
    },

    resolveMessage: function ($element, $attr, key) {
      var metaInformation = this.getMetaInformation($element);
      var message = $element.attr(key + '-notification') || this.getDefaultMessage(key);

      var matchers = angular.extend({}, {validValue: $attr[key]}, metaInformation);
      return $interpolate(message)(matchers);
    }

  };
}]);
