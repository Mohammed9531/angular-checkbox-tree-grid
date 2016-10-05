'use strict';

/**
 * @ngdoc provider
 * @name NgCheckboxTreeTemplateProvider
 *
 * @module ngCheckboxTreeGrid
 *
 * @description
 * Provides user an option to set up global config
 */
angular
    .module('ngCheckboxTreeGrid')
    .provider('NgCheckboxTreeTemplateProvider', ngTCheckboxreeTemplateProvider);

  function ngTCheckboxreeTemplateProvider() {

    // {jshint} complains about possible strict violation
    // adding this line below skips the validation 
    /*jshint validthis: true */

    var
      // default template path
      templatePath = 'template/grid/angularCheckBoxTreeGrid.html',

      // default tree configuration
      gridConfig = {
        expandLevel: 0,
        checkboxTree: false,
        gridType: "checkboxGrid",
        childrenKeyName: 'children',
        iconIndividual: "",
        iconCollapse: "fa fa-angle-down",
        iconExpand: "fa fa-angle-right",
        tableType: "table-bordered table-striped table-hover",
        individualSelect: false
      };

    function setPath(path) {
      templatePath = path;
    }

    function getPath() {
      return templatePath;
    }

    function setGridConfig(config) {
      gridConfig = config;
    }

    function getGridConfig() {
      return gridConfig;
    }

    this.$get = function() {
      return {
        setPath: setPath,
        getPath: getPath,
        setGridConfig: setGridConfig,
        getGridConfig: getGridConfig
      };
    };
  }