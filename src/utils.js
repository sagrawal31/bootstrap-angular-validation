/* global document, window */

'use strict';

if (!window.jQuery && !angular.element.prototype.find) {
  /**
   * @ngdoc function
   * @name angular.element.prototype.find
   * @param {String} selector name.
   * @description Mimic jQuery find method. Returns the elements within the document that matches the specified
   * group of selectors. This methods are injected to angular.element() instances. Used when jQuery is not available.
   */
  angular.element.prototype.find = function (selector) {
    return angular.element(this[0].querySelectorAll(selector));
  };
}

if (!window.jQuery && !angular.element.prototype.parents) {
  /**
   * @ngdoc function
   * @name angular.element.prototype.parents
   * @param {String} selector name (optional).
   * @description Mimic jQuery parents method.
   * Get the ancestors of each element in the current set of matched elements, optionally filtered by a selector.
   * This methods are injected to angular.element() instances. Used when jQuery is not available.
   */
  angular.element.prototype.parents = function (selector) {
    // At least IE6
    var isIE = /*@cc_on!@*/false || !!document.documentMode;

    var element = this[0];
    var parents = [];

    // Traverse element's ancestor tree until the upto the root and pushing all the ancestors to an array.
    while (element.parentNode.parentNode) {
      element = element.parentNode;

      // Get the ancestors of element filtered by a selector (if any)
      if (selector) {
        if (isIE) {
          /*
           * For IE versions less then 9. Since Microsoft introduces msMatchesSelector method from 9.
           * @see Browser compatibility in https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
           */
          if (element.msMatchesSelector(selector)) {
            parents.push(element);
          }
        } else {
          if (element.matches(selector)) {
            parents.push(element);
          }
        }
      } else {
        // If no selector is defined then get all the ancestors with no filtering
        parents.push(element);
      }
    }
    return angular.element(parents);
  };
}