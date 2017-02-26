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

  var _genericValidators = [{
    name: "digits",
    validateFn: function(value) {
      return (/^\d+$/).test(value);
    },
    class: ""
  }, {
    name: "equalto",
    validateFn: function(value, $scope, attr) {
      return value + '' === $scope.$eval(attr.equalto) + '';
    },
    class: ""
  }, {
    name: "number",
    validateFn: function(value) {
      return (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/).test(value);
    },
    class: ""
  }, {
    name: "min",
    validateFn: function(value, $scope, attr) {
      return parseFloat(value) >= parseFloat(attr.min);
    },
    class: ""
  }, {
    name: "max",
    validateFn: function(value, $scope, attr) {
      return parseFloat(value) <= parseFloat(attr.max);
    },
    class: ""
  }, {
    name: "length",
    validateFn: function(value, $scope, attr) {
      return value.length === parseInt(attr.length);
    },
    class: ""
  }, {
    name: "strictemail",
    validateFn: function(value) {
      return new RegExp(/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/).test(value);
    },
    class: ""
  }];

  function getValidator(name) {
    for (var i = 0; i < _genericValidators.length; i++) {
      if (name === _genericValidators[i].name) {
        return _genericValidators[i];
      }
    }
    return null;
  }

  var genericValidators = {
    digits: function(value) {
      return (/^\d+$/).test(value);
    },
    equalto: function(value, $scope, attr) {
      return value + '' === $scope.$eval(attr.equalto) + '';
    },
    number: function(value) {
      return (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/).test(value);
    },
    min: function(value, $scope, attr) {
      return parseFloat(value) >= parseFloat(attr.min);
    },
    max: function(value, $scope, attr) {
      return parseFloat(value) <= parseFloat(attr.max);
    },
    length: function(value, $scope, attr) {
      return value.length === parseInt(attr.length);
    },
    strictemail: function(value) {
      return new RegExp(/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/).test(value);
    }
  };

  function getTrigger($element, triggerEvent) {
    var attributeName = 'bs-trigger';
    if ($element.attr(attributeName)) {
      return $element.attr(attributeName) === triggerEvent;
    }

    var parentForm = $element.parents('form');
    if (parentForm && parentForm.attr(attributeName)) {
      return parentForm.attr(attributeName) === triggerEvent;
    }

    // Use the global config
    return validationConfig.shouldValidateOn(triggerEvent);
  }

  var meta = ['matchName'];

  return {
    /**
     * Search all the input element inside the given DOM element and apply the 'bs-validation' directive so we
     * need not a add it for every form element.
     */
    getValidators: function() {
      var validatorNames = [];
      for (var i = 0; i < _genericValidators; i++) {
        validatorNames.push(_genericValidators[i].name);
      }
      return validatorNames;
    },

    getMetaInformation: function($element) {
      var metaInformation = {};

      angular.forEach(meta, function(key) {
        metaInformation[key] = $element.attr(key) || $element.attr(key.camelCaseToDash());
      });

      return metaInformation;
    },

    addErrorClass: function($formGroupElement) {
      this.removeSuccessClass($formGroupElement);
      $formGroupElement.addClass(validationConfig.errorClass);
    },

    addSuccessClass: function($formGroupElement) {
      this.removeErrorClass($formGroupElement);

      if (validationConfig.shouldAddSuccessClass()) {
        $formGroupElement.addClass(validationConfig.successClass);
      }
    },

    addValidator: function($scope, $element, $attr, ngModelController, validatorKey) {
      ngModelController.$validators[validatorKey] = function(modelValue, viewValue) {
        var value = modelValue || viewValue;
        if (!ngModelController.$isEmpty(value)) {
          var validator = getValidator(name);
          var validationResult = validator.validateFn(value, $scope, $attr);

          if (validationResult) {
            $element.removeClass(validator.class);
          }
          else {
            $element.addClass(validator.class);
          }

          return validationResult;
        }

        return true;
      };
    },

    addCustomValidator: function(name, validateFn, cssClass) {
      var
        _genericValidators.push({
          name: name,
          validateFn: validateFn,
          class: cssClass
        });
    },

    displayErrorPreference: function($element, $attr) {
      var attrName = displayErrorAsAttrName;
      if ($attr[attrName]) {
        return $attr[attrName];
      } else {
        var $parentForm = $element.parents('form');

        // .attr() method not accepting camelCase version of the attribute name. Converting it to dashed-case
        attrName = attrName.camelCaseToDash();

        if ($parentForm && $parentForm.attr(attrName)) {
          return $parentForm.attr(attrName);
        }
      }

      // Use the global preference
      return validationConfig.getDisplayErrorsAs();
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

    isValidationDisabled: function($element) {
      var attribute = 'bs-no-validation';
      if ($element[0].attributes.hasOwnProperty(attribute)) {
        return true;
      }

      var $parentForm = $element.parents('form');
      return $parentForm[0] && $parentForm[0].attributes.hasOwnProperty(attribute);
    },

    removeErrorClass: function($formGroupElement) {
      $formGroupElement.removeClass(validationConfig.errorClass);
    },

    removeSuccessClass: function($formGroupElement) {
      $formGroupElement.removeClass(validationConfig.successClass);
    },

    resolveMessage: function($element, $attr, key) {
      var metaInformation = this.getMetaInformation($element);
      var message = $element.attr(key + '-notification') || validationConfig.messages[key];

      if (!message) {
        console.warn('No message found for the key [' + key + ']. Consider adding a global message or element' +
          ' specific message using attribute [' + key + '-notification="My custom message"]');

        message = 'Please fix this field';
      }

      var matchers = angular.extend({}, {validValue: $attr[key]}, metaInformation);
      return $interpolate(message)(matchers);
    },

    shouldValidateOnBlur: function($element) {
      return getTrigger($element, 'blur');
    },

    shouldValidateOnDisplay: function($element) {
      return getTrigger($element, 'display');
    },

    shouldValidateOnSubmit: function($element) {
      return getTrigger($element, 'submit');
    }

  };
}]);
