"use strict";

/**
 * @ngdoc directive
 * @name form
 * @requires $parse 
 * @requires $rootScope
 * 
 * @description
 * Using form element as directive, we don't require to put the "bs-validation" directive to every form element.
 * To add handler on submit, use <code>on-submit</code> instead of <code>ng-submit</code>,
 * since ng-submit directive doesn't cares about validation errors.
 */
angular.module("bootstrap.angular.validation").directive("form", ["$parse", "$rootScope", "BsValidationService",
        function($parse, $rootScope, bsValidationService) {

    return {
        restrict: "E",
        require: "form",
        priority: 1000,     // Setting a higher priority so that, this directive compiles first.
        compile: function($formElement, $formAttributes) {
            // Disable HTML5 validation display
            $formElement.attr("novalidate", "novalidate");
            bsValidationService.addDirective($formElement);

            /**
             * If there is an "ng-include" directive available inside a form then the "bs-validation" directive
             * won't get applied until Angular resolves the view sourced by "ng-include".
             */
            var nestedNgIncludeElement = $formElement.findAll("[ng-include]");
            if (nestedNgIncludeElement.length > 0) {
                var src = $parse(nestedNgIncludeElement.attr("ng-include"))();

                /**
                 * Then add the source URL of ng-include to a list so that in the response interceptor, we can add
                 * the "bs-validation" directive. We can do this by recompiling here the content after the content is
                 * loaded but that leads to some problem and also increases the rendering time.
                 * 
                 * @see response interceptor in app.js
                 */
                bsValidationService.addToNgIncludedURLs(src);
            }

            var ngSubmit = $formAttributes.ngSubmit;
            /*
             * Removing ngSubmit attribute if any since ngSubmit by default doesn't respects the validation errors
             * on the input fields.
             */
            delete $formAttributes.ngSubmit;

            var preLinkFunction = function($scope, formElement, $attr, formController) {
                // Expose a method to manually trigger the validation
                formController.$validate = function() {
                    formController.$setSubmitted();
                };

                formElement.on("submit", function(e) {
                    // If any of the form element has not passed the validation
                    if (formController.$invalid) {
                        // Then focus the first invalid element
                        formElement[0].querySelector(".ng-invalid").focus();
                        return false;
                    }

                    // Parse the handler of ng-submit & execute it
                    var submitHandler = $parse(ngSubmit);
                    $scope.$apply(function() {
                        submitHandler($scope, {$event: e});

                        /*
                         * Do not show validation errors once the form gets submitted. You can still display the
                         * validation errors after form submission by calling "$setSubmitted" in your form controller.
                         */
                        formController.$setPristine();
                    });

                    /**
                     * Prevent other submit event listener registered via Angular so that we can mark the form with
                     * the prestine state. Otherwise, that Angular's listener is getting called at the last and is again
                     * setting form to the submitted.
                     *
                     * https://api.jquery.com/event.stopimmediatepropagation/
                     */
                    e.stopImmediatePropagation();
                    return false;
                });
            };

            return {
                pre: preLinkFunction
            };
        }
    };
}]);