"use strict";

/**
 * @ngdoc directive
 * @name bsValidation
 * @requires $interpolate
 * @requires BsValidationService
 * @description
 * This directive must be applied to every input element on which we need to use custom validations like jQuery.
 * Those element must have ng-model attributes. This directive will automatically add the "has-error" class on the
 * parent element with class ".form-group" and will show/hide the validation message automatically.
 * 
 * Custom supported validations are:
 * 
 * 1. For number, add attribute number instead of type number in input class (for int, float & double),
 * 2. For digits, add attribute digits (only for int),
 * 3. For minimum length validation, use HTML5 minlength attribute (Will work for non HTML5 browsers),
 * 4. For maximum length validation, use HTML5 maxlength attribute (Will work for non HTML5 browsers),
 * 5. For max number validation, use HTML5 max attribute,
 * 6. For min number validation, use HTML5 min attribute,
 * 7. For required validation, use HTML5 required attribute.
 * 
 * On any validation error, a default message will be shown to users, which can be customized dynamically with the
 * element itself. Hence this will work great for Angular UI validation.
 */
angular.module("bootstrap.angular.validation").directive("bsValidation", ["$interpolate", "BsValidationService", function($interpolate, bsValidationService) {
    return {
        restrict: "A",
        require: "ngModel",
        link: function($scope, $element, $attr, ngModelController) {
            var errorElementClass = "bs-invalid-msg";
            // All classed needed to add to validation message
            var errorClasses = [errorElementClass, "help-block"];
            var markupClasses = errorClasses.join(" ");

            // Search parent element with class form-group to operate on.
            var formGroupElement = $element.parents(".form-group");

            // Search for an attribute "form-group" if the class ".form-group" is not available
            if (!formGroupElement || formGroupElement.length === 0) {
                formGroupElement = $element.parents("[form-group]");
            }

            /*
             * Used to resolve the message for current validation failure. Will first search the title attribute
             * with the validation key and then fallback to use the default message.
             */
            function resolveMessage(element, key) {
                /*
                 * First search if the input element has a custom message for a particular validation key. For example:
                 * Check if "title-required" attribute is present on the element to display the validation error message
                 * when the field is required.
                 */
                var message = element.attr("title-" + key);

                if (!message) {
                    message = bsValidationService.getDefaultMessage(key);

                    if (!message) {
                        console.warn("Not found any message for the key", key);
                        return "Please fix the error.";
                    }
                }

                // Format the string if it contains any variable. Like <code>String.format()</code> in Java.
                return $interpolate(message)({validValue: $attr[key]});
            }

            /**
             * Display or hide validation errors for a single element.
             */
            function displayOrHideError() {
                /*
                 * Do not show or hide error for current element don't have any validation errors or has validation
                 * error but user has not attempted to submit the form yet.
                 */
                if (!$scope.formSubmissionAttempted || !ngModelController.$invalid) {
                    formGroupElement.removeClass("has-error");

                    if (formGroupElement.length > 0) {
                        formGroupElement.findAll("span." + errorClasses.join(".")).addClass("ng-hide");
                    }
                    return false;
                }

                /**
                 * Display the first error for the current element. For multiple validations, this $error object will
                 * be like this:
                 *
                 * $error = {
                 *     required: true,  // When field is marked as required but not entered.
                 *     minlength: true,
                 *     number: false
                 * }
                 */
                var allErrorKeys = Object.keys(ngModelController.$error);
                var firstErrorKey = allErrorKeys[0];

                // Add bootstrap error class
                formGroupElement.addClass("has-error");

                var message = resolveMessage($element, firstErrorKey);

                // Find if the parent class already have error message container
                var errorElement = formGroupElement.findOne("." + errorElementClass);
                var iconMarkup = "<i class=\"fa fa-exclamation-triangle fa-fw\"></i>";

                // If not, then append an error container
                if (errorElement.length === 0) {
                    var insertAfter = $element;
                    // Check if the container have any Bootstrap input group then append the error after it
                    var groupElement = formGroupElement.findOne(".input-group");
                    if (groupElement.length > 0) {
                        insertAfter = groupElement;
                    }

                    var errorMarkup = "<span class=\"" + markupClasses + "\">" + iconMarkup + message + "</span>";
                    insertAfter.after(errorMarkup);
                } else {
                    // Else change the message.
                    errorElement.html(iconMarkup + message).removeClass("ng-hide");
                }
            }

            var validators = ["equalTo", "min", "max", "number", "digits", "length"];
            // Register generic custom validators if added to element
            angular.forEach(validators, function(key) {
                var attrValue = $element.attr(key);
                if (attrValue || (typeof attrValue !== "undefined" && attrValue !== false) || $attr[key]) {
                    bsValidationService.addValidator($scope, $attr, ngModelController, key);
                }
            });

            // Look when user try to submit the form & display validation errors.
            $scope.$watchCollection(function() {
                return $scope.formSubmissionAttempted && ngModelController.$error;
            }, displayOrHideError);
        }
    };
}]);