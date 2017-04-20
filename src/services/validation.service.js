'use strict';

/**
 * @ngcode service
 * @name BsValidationService
 * @description Core service of this module to provide various default validations.
 */
angular.module('bootstrap.angular.validation').factory('BsValidationService', ['$interpolate', 'bsValidationConfig',
  '$injector', '$filter', function ($interpolate, validationConfig, $injector, $filter) {

    var displayErrorAsAttrName = 'bsDisplayErrorAs';
    var customFormGroup = '[bs-form-group]';
    var formGroupClass = '.form-group';

    var _genericValidators = [{
      name: 'digits',
      validateFn: function (value) {
        return (/^\d+$/).test(value);
      }
    }, {
      name: 'equalto',
      validateFn: function (value, $scope, attr) {
        return value + '' === $scope.$eval(attr.equalto) + '';
      }
    }, {
      name: 'number',
      validateFn: function (value) {
        return (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/).test(value);
      }
    }, {
      name: 'min',
      validateFn: function (value, $scope, attr) {
        return parseFloat(value) >= parseFloat(attr.min);
      }
    }, {
      name: 'max',
      validateFn: function (value, $scope, attr) {
        return parseFloat(value) <= parseFloat(attr.max);
      }
    }, {
      name: 'length',
      validateFn: function (value, $scope, attr) {
        return value.length === parseInt(attr.length);
      }
    }, {
      name: 'strictemail',
      validateFn: function (value) {
        return new RegExp(/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/).test(value);
      }
    }];

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

    function removeClassByPrefix(element, prefix) {
      var regx = new RegExp('\\b' + prefix + '.*\\b', 'g');
      element[0].className = element[0].className.replace(regx, '').replace(/\s\s+/g, ' ');
      return element;
    }

    var meta = ['matchName'];

    return {
      getValidators: function () {
        return _genericValidators;
      },

      getMetaInformation: function ($element) {
        var metaInformation = {};

        angular.forEach(meta, function (key) {
          metaInformation[key] = $element.attr(key) || $element.attr(key.camelCaseToDash());
        });

        return metaInformation;
      },

      addErrorClass: function ($formGroupElement) {
        this.removeSuccessClass($formGroupElement);
        $formGroupElement.addClass(validationConfig.errorClass);
      },

      addSuccessClass: function ($formGroupElement) {
        this.removeErrorClass($formGroupElement);

        if (validationConfig.shouldAddSuccessClass()) {
          $formGroupElement.addClass(validationConfig.successClass);
        }
      },

      addValidator: function ($scope, $element, $attr, ngModelController, validator) {
        ngModelController.$validators[validator.name] = function (modelValue, viewValue) {
          var value = modelValue || viewValue;
          if (ngModelController.$isEmpty(value)) {
            return true;
          }

          // See https://github.com/sagrawal14/angular-extras/blob/v0.1.3/src/extras/array.js#L91 for "find" function
          return validator.validateFn(value, $scope, $attr);
        };
      },

      /**
       * Add a custom validator to the list of generic validators.
       * @param genericValidationObject for example, to a add a generic validator to accept either "foo" or "bar":
       * {
     *     name: 'foobar',
     *     validateFn: function(value, $scope, attr) {
     *         return value === 'foo' || value === 'bar';
     *     }
     * }
       */
      addGenericValidator: function (genericValidationObject) {
        _genericValidators.push(genericValidationObject);
      },

      displayErrorPreference: function ($element, $attr) {
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

      getErrorMessage: function ($element, $attr, ngModelController) {
        var firstErrorKey = Object.keys(ngModelController.$error)[0];
        return validationConfig.getErrorMessagePrefix() + this.resolveMessage($element, $attr, firstErrorKey);
      },

      getFormGroupElement: function ($element) {
        // First search for an attribute with 'bs-form-group'
        var formGroupElement = $element.parents(customFormGroup);

        if (!formGroupElement || formGroupElement.length === 0) {
          // Then search for parent element with class form-group
          formGroupElement = $element.parents(formGroupClass);

          if (!formGroupElement || formGroupElement.length === 0) {
            return null;
          }
        }

        return formGroupElement;
      },

      getValidationMessageService: function (displayType) {
        var validationMessageService;

        try {
          validationMessageService = $injector.get(displayType + 'MessageService');
        } catch (e) {
          throw 'No message service found for type [' + displayType + '].';
        }

        if (displayType === 'tooltip' && !$injector.has('$uibPosition')) {
          throw '$uibPosition service required from the ui-bootstrap module in order to use the tooltip message.';
        }

        return validationMessageService;
      },

      isValidationDisabled: function ($element) {
        var attribute = 'bs-no-validation';
        if ($element[0].attributes.hasOwnProperty(attribute)) {
          return true;
        }

        var $parentForm = $element.parents('form');
        return $parentForm[0] && $parentForm[0].attributes.hasOwnProperty(attribute);
      },

      removeErrorClass: function ($formGroupElement) {
        $formGroupElement.removeClass(validationConfig.errorClass);
      },

      removeSuccessClass: function ($formGroupElement) {
        $formGroupElement.removeClass(validationConfig.successClass);
      },

      resolveMessage: function ($element, $attr, key) {
        var metaInformation = this.getMetaInformation($element);
        var messageFilters = $element.attr(key + '-notification-filter') || validationConfig.getMessageFilters();
        var message = $element.attr(key + '-notification') || validationConfig.messages[key];

        if (!message) {
          console.warn('No message found for the key [' + key + ']. Consider adding a global message or element' +
            ' specific message using attribute [' + key + '-notification="My custom message"]');

          message = 'Please fix this field';
        }

        if (angular.isDefined(messageFilters)) {
          if (!angular.isArray(messageFilters)) {
            messageFilters = [messageFilters];
          }

          for (var i = 0; i < messageFilters.length; i++) {
            message = $filter(messageFilters[i])(message);
          }
        }

        var matchers = angular.extend({}, {validValue: $attr[key]}, metaInformation);
        return $interpolate(message)(matchers);
      },

      shouldValidateOnBlur: function ($element) {
        return getTrigger($element, 'blur');
      },

      shouldValidateOnDisplay: function ($element) {
        return getTrigger($element, 'display');
      },

      shouldValidateOnSubmit: function ($element) {
        return getTrigger($element, 'submit');
      },

      /**
       * Add or remove various classes on form-group element. For example, if an input has two errors "required" & "min"
       * then whenever the validation fails, form-group element will have classes like "bs-has-error-required" or
       * "bs-has-error-min".
       * @param $formGroupElement jQLite/jQuery form-group element
       * @param errors Errors object as returned by ngModelController.$error
       */
      toggleErrorKeyClasses: function ($formGroupElement, errors) {
        removeClassByPrefix($formGroupElement, 'bs-has-error-');

        angular.forEach(errors, function (value, key) {
          $formGroupElement.addClass('bs-has-error-' + key);
        });
      }

    };
  }]);
