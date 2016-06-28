/* global document */

'use strict';

angular.module('bootstrap.angular.validation').provider('bsValidationConfig', function() {

  // Can be a string or list of any combination of "blur", "submit" & "display"
  var validateFieldsOn = 'blur';

  function shouldValidateOn(event) {
    if (angular.isString(validateFieldsOn)) {
      return validateFieldsOn === event;
    }

    return validateFieldsOn.indexOf(event) !== -1;
  }

  var _this = this;

  // Values can be "simple" or "tooltip"
  _this.displayErrorsAs = 'simple';

  _this.addSuccessClass = true;

  _this.setValidateFieldsOn = function(event) {
    if (!event) {
      throw 'Please provide an string or list of events to validate fields on';
    }

    if (!angular.isString(event) && !angular.isArray(event)) {
      throw 'Event should either be a string or a list';
    }

    validateFieldsOn = event;
  };

  _this.$get = [function() {
    return {
      shouldAddSuccessClass: function() {
        return _this.addSuccessClass;
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
