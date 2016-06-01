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
                    $scope.formSubmissionAttempted = true;
                };

                formElement.on("submit", function(e) {
                    $scope.$apply(function() {
                        /*
                         * Notify all "bs-validation" directive that user has tried submitting the form, now we can
                         * display validation error messages (if any). This is required, since if we immediately
                         * starts displaying the validation error messages as the form displayed or as the user starts
                         * typing, that will not a good user experience.
                         */
                        $scope.formSubmissionAttempted = true;
                    });

                    // If any of the form element does not pass the validation
                    if (formController.$invalid) {
                        // Then focus the first invalid element
                        formElement[0].querySelector(".ng-invalid").focus();
                        return false;
                    }

                    // Parse the handler of ng-submit & execute it
                    var submitHandler = $parse(ngSubmit);
                    $scope.$apply(function() {
                        submitHandler($scope, {$event: e});
                        $scope.formSubmissionAttempted = false;
                    });

                    return true;
                });
            };

            return {
                pre: preLinkFunction
            };
        }
    };
}]);