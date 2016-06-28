# Change Log

## 0.0.6

This release contains contribution from [Julian Beisenkötter](https://github.com/julianbei). Thanks for his effort.

### New Features

1. New `strictemail` validation

### Improvements

1. Code refactoring based on Style guide changes. Code is more readable
2. Validations now show up on blur

## 0.0.4 & 0.0.5

1. Typo fix in method call and fixed page reload after form submission.

## 0.0.3

1. Changed attribute `form-group` to `bs-form-group`. Documentation still missing :(

## 0.0.2

### Improvements

1. Adding support for automatically adding `validation-errors` directive on input elment with `data-ng-model` attribute
2. Using `$validators` in ngModelController introduced in Angular 1.3.0 (hence require Angular >= 1.3.0)
3. Reducing `n` number of Angular watchers for `n` number of input elements
4. Removed requirement of changing `ng-submit` to `on-submit`. Now `ng-submit` will be called if the form is valid
5. Now one can easily set the form to it's pristine state after submission.

## 0.0.1

1. First version of the basic validation in Angular with Bootstrap like jQuery.