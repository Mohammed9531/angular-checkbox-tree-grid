'use strict';

/**
 * @ngdoc directive
 * @name ngCheckboxTreeGrid
 * @restrict A
 * @requires $compile
 *
 * @module ngCheckboxTreeGrid
 *
 * @description
 * Allows user to customize the template, iff for any reason you want to use
 * a custom HTML to show a specific cell, for showing an image, colorpicker, or 
 * something else, you can use the cellTemplate option in the col-defs array, 
 * just use {{ row.branch[col.field] }} as the placeholder for the value of the 
 * cell anywhere in the HTML - use {{ row.branch[expandingProperty.field] }} if 
 * providing a template for the expanding property.
 */
angular
  .module("ngCheckboxTreeGrid")
  .directive("compile", compile);

compile.$inject = ["$compile"];

function compile($compile) {

  // returns elem isolated scope
  return {
    restrict: 'A',
    link: link
  };

  function link(scope, element, attrs) {
    // watch for changes to expression.
    scope.$watch(attrs.compile, function(new_val) {

      /**
       * compile creates a linking function
       * that can be used with any scope.
       */
      var link = $compile(new_val);

      /**
       * new element gets created by executing
       * the link method
       */
      var new_elem = link(scope);

      // Which we can then append to our DOM element.
      element.append(new_elem);
    });
  }
}