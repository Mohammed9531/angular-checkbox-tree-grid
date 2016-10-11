'use strict';

/**
 * @ngdoc provider
 * @name NgCheckboxTree
 *
 * @module ngCheckboxTreeGrid
 *
 * @description
 * Provides user an option to set up global config
 */
angular
    .module('ngCheckboxTreeGrid')
    .provider('NgCheckboxTree', ngTCheckboxrtree);

  function ngTCheckboxrtree() {

    // {jshint} complains about possible strict violation
    // adding this line below skips the validation
    /*jshint validthis: true */

    var
      // default template path
      templatePath = 'template/grid/angularCheckBoxTreeGrid.html',

      // default tree configuration
      gridConfig = {
        expandLevel: 0,
        iconIndividual: "",
        checkboxTree: false,
        individualSelect: false,
        gridType: "checkboxGrid",
        highlightSelected : false,
        childrenKeyName: 'children',
        iconExpand: "fa fa-angle-right",
        iconCollapse: "fa fa-angle-down",
        tableType: "table table-bordered table-striped table-hover"
      };

    function setPath(path) {
      templatePath = path;
    }

    function getPath() {
      return templatePath;
    }

    function setGridConfig(config) {
      gridConfig = angular.extend({}, gridConfig, config);
    }

    function getGridConfig() {
      return gridConfig;
    }

    this.setPath = setPath;
    this.setGridConfig = setGridConfig;

    this.$get = function() {
      return {
        getPath: getPath,
        getGridConfig: getGridConfig
      };
    };
  }