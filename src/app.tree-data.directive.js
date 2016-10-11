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
  'NgTreeTemplatesService',
];

function ngCheckboxTreeGrid(
  $timeout, $templateCache, NgCheckboxTree,
  NgTreeTemplatesService) {

  // returns elem isolated scope
  return {
    restrict: 'E',
    replace: true,
    scope: {
      colDefs: '=',
      expandOn: '=',
      onSelect: '&',
      treeData: '=',
      treeModel: '=',
      treeConfig: '=',
      treeControl: '=',
      onBranchClick: '&'
    },
    link: link,
    templateUrl: templateUrl
  };

  function templateUrl(elem, attrs) {
    if (!attrs.templateUrl) {
      return NgTreeTemplatesService[(attrs.gridType) ? "getTemplatePath" : "getTemplate"](attrs.gridType);
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
      dataService = new DataService({
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

      // renders the tree data
      scope.treeRows = dataService.flattenTreeData(data) || [];
    };

    // initialize the grid configuration
    scope.init();

    // re-render the grid template on config change
    scope.$watch("treeConfig", scope.init, true);

    // process nodes on tree model change
    scope.$watch('treeModel', dataService.onTreeModelChange, true);

    scope.onBranchToggle = function(row) {
      dataService.onBranchToggle(row);
    };

    scope.onSelect = function(row, selection) {
      dataService.onSelect(row, selection, scope.individualSelect);
      scope.treeModel = dataService.getTreeModel();
      scope.rootNode = dataService.isRootNodeSelected();
    };

    scope.onRowClick = function(e, branch) {
      if (scope.highlightSelected) {
        dataService.highlightSelectedNode.call(element, e);
      }
      scope.onBranchClick({
        branch: branch
      });
    };

    scope.onRootSelect = function(selection) {
      dataService.onRootSelect(selection);
      scope.treeModel = dataService.getTreeModel();
    };
  }
}