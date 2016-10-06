'use strict';

/**
 * @ngdoc directive
 * @name ngCheckboxTreeGrid
 *
 * @requires $timeout
 * @requires $templateCache
 * @requires NgCheckboxTree
 * @requires NgTreeGridService
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
  'NgTreeGridService',
  'NgTreeTemplatesService',
];

function ngCheckboxTreeGrid($timeout,
  $templateCache, NgTreeGridService,
  NgTreeTemplatesService, NgCheckboxTree) {

  // returns elem isolated scope
  return {
    restrict: 'E',
    replace: true,
    scope: {
      treeData: '=',
      colDefs: '=',
      expandOn: '=',
      onSelect: '&',
      treeControl: '=',
      treeModel: '=',
      treeConfig: '=',
      onBranchClick: '&'
    },
    link: link,
    templateUrl: templateUrl
  };

  function templateUrl(elem, attrs) {
    if (!attrs.templateUrl) {
      return NgCheckboxTree[(attrs.gridType) ? "getTemplatePath" : "getTemplate"](attrs.gridType);
    }
    return attrs.templateUrl;
  }

  function link(scope, element, attrs) {
    var treeConfig;

    // set expanding property
    scope.expandingProperty = scope.expandOn;

    // merge custom config with defaults
    treeConfig = angular.extend({}, NgCheckboxTree.getGridConfig(), scope.treeConfig);
    scope.checkboxTree = treeConfig.checkboxTree;
    scope.individualSelect = treeConfig.individualSelect;

    // set grid config
    NgTreeGridService.setGridConfig(treeConfig, scope.expandOn);

    scope.$watch('treeModel', NgTreeGridService.onTreeModelChange, true);

    scope.tree_rows = NgTreeGridService.flattenTreeData(scope.treeData) || [];
    console.log(scope.tree_rows);

    scope.onBranchToggle = function(row) {
      NgTreeGridService.onBranchToggle(row);
    };

    scope.onSelect = function(row, selection) {
      NgTreeGridService.onSelect(row, selection, scope.individualSelect);
      scope.treeModel = NgTreeGridService.getTreeModel();
      scope.rootNode = NgTreeGridService.isRootNodeSelected();
    };

    scope.onRootSelect = function(selection) {
      NgTreeGridService.onRootSelect(selection);
      scope.treeModel = NgTreeGridService.getTreeModel();
    };
  }
}