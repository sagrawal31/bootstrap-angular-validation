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

Minimum AngularJS version required: **1.3.0**. If you are using an older version of AngularJS, please use the version
`0.0.1` of this library but that have some known bugs which are fixed in newer versions.

## Features

**A few things to look out for when playing around**

1. Before a field is marked as invalid, the validation is lazy: Before submitting the form for the first time, the user
can tab through fields without getting annoying messages – they won't get bugged before having the chance to actually
enter a correct value

2. Once a field is marked invalid, it is eagerly validated: As soon as the user has entered the necessary value, the
error message is removed.

3. If the user enters something in a non-marked field, and tabs/clicks away from it (blur the field), it is
validated – obviously the user had the intention to enter something, but failed to enter the correct value.

4. After trying to submit an invalid form, the first invalid element is focused, allowing the user to correct the field.

## Compatibility

IE 8 & below are not supported.

## Demo

**Coming soon**

## Usage

### 1. Install via Bower

```shell
bower install bootstrap-angular-validation --save
```

### 2. Add the script to your main HTML file (like index.html)

```html
<script src="bower_components/bootstrap-angular-validation/dist/bootstrap-angular-validation.min.js"></script>
```

Make sure CSS for Bootstrap is also included in your application. Read the [docs](http://getbootstrap.com/getting-started/#download)

### 3. Add dependency to your application

```javascript
var myApp = angular.module("foo", ["bootstrap.angular.validation", "other-foo-depenency"]);
```

### Now Rock!!

Basic Bootstrap validation has enabled in your forms. No further setup and no alternation required. Try submitting a
form with some validation and see the magic. **Make sure your form elements are designed as
Bootstrap [suggests](http://getbootstrap.com/css/#forms).**

## Default error messages

|    Validation   |    Message    |
| ------------- |-------------| -----|
|    required    |    This field is required.    |
|    email    |    Please enter a valid email address.    |
|    url    |    Please enter a valid URL.    |
|    number    |    Please enter a valid number.    |
|    digits    |    Please enter only digits.    |
|    min    |    Please enter a value greater than or equal to {{validValue}}.    |
|    max    |    Please enter a value less than or equal to {{validValue}}.    |
|    length    |    Please enter all {{validValue}} characters.    |
|    minlength    |    Please enter at least {{validValue}} characters.    |
|    maxlength    |    Please enter no more than {{validValue}} characters.    |
|    editable    |    Please select a value from dropdown.    |
|    pattern    |    Please fix the pattern.    |
|    equalTo    |    Please enter the same value again."
