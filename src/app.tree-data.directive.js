'use strict';

/**
 * @ngdoc directive
 * @name ngCheckboxTreeGrid
 *
 * @requires $timeout
 * @requires $templateCache
 * @requires NgCheckboxTree
 * @requires dataService
 * @requires NgTreeTemplatesService
 *
 * @module ngCheckboxTreeGrid
 *
 * @description
 * Directive that constructs the tree grid
 */
angular
  .module("ngCheckboxTreeGrid")
  .directive("ngCheckboxTreeGrid", ngCheckboxTreeGrid);

ngCheckboxTreeGrid.$inject = [
  '$timeout',
  '$templateCache',
  'NgCheckboxTree',
  'NgTreeDataFactory',
  'NgTreeTemplatesService',
];

function ngCheckboxTreeGrid(
  $timeout, $templateCache, NgCheckboxTree,
  NgTreeDataFactory, NgTreeTemplatesService) {

  // returns elem isolated scope
  return {
    restrict: 'E',
    replace: true,
    scope: {
      colDefs: '=',
      expandOn: '=',
      onSelect: '&',
      treeData: '=',
      onBranchClick: '&',
      treeModel: '=?treeModel',
      treeConfig: '=?treeConfig',
      treeControl: '=?treeControl',
      treeProcessedNodes: '=?treeProcessedNodes'
    },
    link: link,
    templateUrl: templateUrl
  };

  function templateUrl(elem, attrs) {
    if (!attrs.templateUrl) {
      return NgTreeTemplatesService[(attrs.gridType) 
      ? "getTemplatePath" 
      : "getTemplate"](attrs.gridType);
    }
    return attrs.templateUrl;
  }

  function link(scope, element, attrs) {
    var treeConfig, dataService;

    // set expanding property
    scope.expandingProperty = scope.expandOn;

    scope.init = function() {
      var data;

      // display/update the template components based on the current configuration
      treeConfig = angular.extend({}, NgCheckboxTree.getGridConfig(), scope.treeConfig);

      // bind tree grid configuration value to the scope
      // update scope
      angular.extend(scope, treeConfig);
      scope.treeConfig = treeConfig;

      // set the grid configuration for each instance
      dataService = NgTreeDataFactory.init({
        config: treeConfig,
        ep: scope.expandOn
      });

      // in case the checkboxtree is disabled dynamically
      // clear out all selected nodes, root node and tree model
      if (!scope.checkboxTree) {

        // delete tree model
        delete scope.treeModel;

        // turn off root node
        scope.rootNode = false;

        // clear out all selected nodes if any
        data = dataService.clearAllSelectedNodes(scope.treeData);
      } else {
        // do nothing in case of checkbox tree is enabled
        data = scope.treeData;
      }
      scope.render(data);
    };

    // updates tree grid & root node model
    scope.updateModel = function() {
      if (scope.checkboxTree) {
        scope.treeModel = dataService.getTreeModel();
        scope.rootNode = dataService.isRootNodeSelected();
      }
    };

    // renders tree data
    scope.render = function(data) {
      // renders the tree data
      dataService.results = [];
      scope.treeRows = dataService.processTreeData(data) || [];

      // expose processed data
      scope.treeProcessedNodes = dataService.getProcessedData();
      scope.updateModel();
    };

    scope.onDataChange = function(n, o) {
      var
      newVal= dataService.flattenTreeData(n),
      oldVal = dataService.flattenTreeData(o);

      // check if an item was added or removed
      if (angular.isArray(n) && angular.isArray(o)) {
        if ((newVal.length > oldVal.length) || (newVal.length < oldVal.length)) {
           dataService.results = [];
           scope.render(n);
        }
        scope.updateModel();
      }
    };

    // initialize the grid configuration
    scope.init();

    // display child nodes
    // update the toggle icon
    scope.onBranchToggle = function(row) {
      dataService.onBranchToggle(row);
    };

    // select all child nodes
    scope.onSelect = function(row, selection) {
      dataService.onSelect(row, selection, scope.individualSelect);
    };

    scope.onRowClick = function(e, branch) {
      // check for highlights
      if (scope.highlightSelected) {
        dataService.highlightSelectedNode.call(element, e);
      }
      // expose current branch data
      scope.onBranchClick({
        branch: branch
      });
    };

    scope.onRootSelect = function(selection) {
      dataService.onRootSelect(selection);
      scope.treeModel = dataService.getTreeModel();
    };

    // watch for any data, config or model changes
    // re-render the grid template on changes
    scope.$watch("treeConfig", scope.init, true);
    scope.$watch("treeData", scope.onDataChange, true);
    scope.$watch('treeModel', dataService.onTreeModelChange, true);
  }
}