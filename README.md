![form validation](https://cloud.githubusercontent.com/assets/1804514/15356658/aee052a2-1d17-11e6-9368-48a2f2b560bb.jpg)

# Bootstrap Angular Validation (No jQuery)

**Inspired by Bootstrap + jQuery form validation**

There are some libraries and various blog post with examples out there which dictates how we can do the basic form
validation in AngularJS application. But those examples are full of code duplicacy and some uses jQuery but there are
no generic solutions.

This library solves the pain of various [Bootstrap](getbootstrap.com) + AngularJS developers by providing
[jQuery like validation](https://jqueryvalidation.org/documentation/)(of course without the jQuery) and using the
Bootstrap's [form validation classes](http://getbootstrap.com/css/#forms-control-validation).

1. This module uses [ES5](https://github.com/airbnb/javascript/tree/master/es5) style guide.

## Compatibility

1. Minimum AngularJS version required: **1.3.0**. If you are using an older version of AngularJS, please use the version
`0.0.1` of this library but that have some known bugs which are fixed in newer versions.

2. IE 8 & below are not supported.

## Change Log

See [Releases](https://github.com/sagrawal14/bootstrap-angular-validation/releases) for changes.

## Usage

### 1. Install via Bower

```shell
bower install bootstrap-angular-validation --save
```

### 2. Add the script to your main HTML file (like index.html)

```html
<script src="bower_components/bootstrap-angular-validation/dist/bootstrap-angular-validation-all.min.js"></script>
```

Make sure CSS for Bootstrap is also included in your application. Read the [docs](http://getbootstrap.com/getting-started/#download)

### 3. Add dependency to your application

```javascript
var myApp = angular.module("foo", ["bootstrap.angular.validation", "other-foo-depenency"]);
```

### Now Rock!!

Basic Bootstrap validation has enabled in your forms. No further setup and no alternation required. Try submitting a
form with some validation and see the magic.

## Detailed Documentation, Configurations & Examples:

http://sagrawal31.github.io/bootstrap-angular-validation/


## Known Issues

### Using jQuery

```
TypeError: a.parents is not a function
    at Object.isValidationDisabled 

at dist/bootstrap-angular-validation-all.min.js:1:9087)
```

This library was developed to be used without the requirement of jQuery by
[adding](https://github.com/sagrawal31/bootstrap-angular-validation/blob/v1.0.7/src/utils.js) a few helpful methods
(for example: `find`, `parents` etc.) to the Angular's jqLite but if your app uses jQuery then the jQuery MUST be 
added before angular to use the methods from jQuery itself instead of jqLite otherwise you will see various errors 
in the console while using this library or displaying the validation errors might not work. 

```html
<!-- First include jquery -->
<script src="bower_components/jquery/dist/jquery.js"></script>
<!-- And then Angular -->
<script src="bower_components/angular/angular.js"></script>
<!-- And then other dependencies -->
```

If you are using [`grunt-wiredep`](https://github.com/stephenplusplus/grunt-wiredep) >= v3.0.0 (or eventually 
[`wiredep`](https://github.com/taptapship/wiredep) >= v3.0.0) and having trouble injecting jquery before angular, 
then add the following in your `bower.json` file under the `"overrides"` block:

```json
"angular": {
  "dependencies": {
    "jquery": "3.2.1"
  }
}
```

This will tell `wiredep` that jquery is needed for angular and should be added before angular.
