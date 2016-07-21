'use strict';

angular.module('bootstrap.angular.validation').provider('bsValidationConfig', function() {

  // Can be a string or list of any combination of "blur", "submit" & "display"
  var validateFieldsOn = 'blur';
  // Display the validation error message below the `input` field with class "help-block"
  var displayErrorsAs = 'simple';

  function shouldValidateOn(event) {
    if (angular.isString(validateFieldsOn)) {
      return validateFieldsOn === event;
    }

    return validateFieldsOn.indexOf(event) !== -1;
  }

  var _this = this;
  this.global = {};
  this.global.addSuccessClass = true;
  this.global.errorClass = 'has-error';
  this.global.successClass = 'has-success';
  this.global.errorMessagePrefix = '';
  this.global.tooltipPlacement = 'bottom-left';
  this.global.tooltipAppendToBody = false;

  this.global.messages = {
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
    equalto: 'Please enter the same {{matchName}} again.'
  };

  this.global.setValidateFieldsOn = function(event) {
    if (!event) {
      throw 'Please provide an string or list of events to validate fields on';
    }

    if (!angular.isString(event) && !angular.isArray(event)) {
      throw 'Event should either be a string or a list';
    }

    validateFieldsOn = event;
  };

  this.global.setDisplayErrorsAs = function(type) {
    if (!type) {
      throw 'Please provide the way validation error should be displayed. In-built options are "simple" & "tooltip".';
    }

    displayErrorsAs = type;
  };

  this.$get = [function() {
    return {
      messages: _this.global.messages,
      errorClass: _this.global.errorClass,
      successClass: _this.global.successClass,
      tooltipAppendToBody: _this.global.tooltipAppendToBody,

      getDisplayErrorsAs: function() {
        return displayErrorsAs;
      },

      getErrorMessagePrefix: function() {
        return _this.global.errorMessagePrefix || '';
      },

      getTooltipPlacement: function() {
        return _this.global.tooltipPlacement;
      },

      shouldAddSuccessClass: function() {
        return _this.global.addSuccessClass;
      },

      shouldValidateOnBlur: function() {
        return shouldValidateOn('blur');
      },

      shouldValidateOnSubmit: function() {
        return shouldValidateOn('submit');
      },

      shouldValidateOnDisplay: function() {
        return shouldValidateOn('display');
      }
    };
  }];
});
