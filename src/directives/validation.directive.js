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
            // All classed needed to add to validation message
            var errorClasses = ["validation-error", "help-block"];
            var searchableClasses = errorClasses.join(",");
            var markupClasses = errorClasses.join(" ");

            // Search parent element with class form-group to operate on.
            var formGroupElement = $element.parents(".form-group");

            /*
             * Used to resolve the message for current validation failure. Will first search the title attribute
             * with the validation key and then fallback to use the default message.
             */
            function resolveMessage(element, key) {
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
                 * Do not show or hide error for current element don"t have any validation errors or has validation
                 * error but user has not attempted to submit the form yet.
                 */
                if (!$scope.formSubmissionAttempted || !ngModelController.$invalid) {
                    formGroupElement.removeClass("has-error");

                    if (formGroupElement.length > 0) {
                        formGroupElement.findAll("span." + errorClasses.join(".")).remove();
                    }
                    return false;
                }

                var oneErrorDisplayed = false;

                /**
                 * Iterate through each error for the current element & display only the first error.
                 * For multiple validation, this $error object will be like this:
                 *
                 * $error = {
                 *     required: true,  // When field is marked as required but not entered.
                 *     minlength: true,
                 *     number: false
                 * }
                 */
                angular.forEach(ngModelController.$error, function(value, key) {
                    if (value && !oneErrorDisplayed) {
                        // Add bootstrap error class
                        formGroupElement.addClass("has-error");

                        var message = resolveMessage($element, key);
                        // Find if the parent class already have error message container.
                        var errorElement = formGroupElement.findOne("span." + searchableClasses);
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
                            errorElement.html(iconMarkup + message);
                        }

                        // Mark that, first error is displayed. TODO Can use a much cleaner solution.
                        oneErrorDisplayed = true;
                    }
                });
            }

            var validators = ["equalTo", "minlength", "maxlength", "min", "max", "number", "digits", "length"];
            // Register generic custom validators if added to element
            angular.forEach(validators, function(key) {
                var attrValue = $element.attr(key);
                if (attrValue || (typeof attrValue !== "undefined" && attrValue !== false) || $attr[key]) {
                    bsValidationService.addValidator($scope, $attr, ngModelController, key);
                }
            });

            $scope.$watch($attr.ngModel, function() {
                displayOrHideError();
            });

            // Look when user try to submit the form & display validation errors.
            $scope.$watch("formSubmissionAttempted", function() {
                displayOrHideError();
            });
        }
    };
}]);