'use strict';

/**
 * @ngdoc run
 * @name run
 * @requires $templateCache
 *
 * @module angular-checkbox-tree-grid
 *
 * @description
 * Stores grid templates in $templateCache
 *
 * @example
 * Checkbox table grid path = "template/grid/angularCheckBoxTreeGrid.html"
 * Nav list tree path = "template/list/angularCheckBoxTreeList.html"
 */

// create main module with no dependencies
angular
  .module("angular-checkbox-tree-grid")
  .run(run);

// inject dependencies
// minification safe
run.$inject = ["$templateCache"];

function run($templateCache) {
  $templateCache.put("template/grid/angularCheckBoxTreeGrid.html",
    '<div class="table-responsive">\n' +
    ' <table class="tree-grid" ng-class="tableType">\n' +
    '   <thead>\n' +
    '     <tr>\n' +
    '        <th style="width:5%;" ng-show="checkboxTree">\n' +
    '           <input type="checkbox" ng-click="onRootSelect(rootNode)" ng-model="rootNode" />\n' +
    '       </th>\n' +
    '       <th>{{expandingProperty.displayName || expandingProperty.field || expandingProperty}}</th>\n' +
    '       <th ng-repeat="col in colDefinitions">{{col.displayName}}</th>\n' +
    '     </tr>\n' +
    '   </thead>\n' +
    '   <tbody>\n' +
    '     <tr ng-repeat="row in treeRows | filter:{visible:true} track by row.uid"\n' +
    '       ng-class="\'level-\' + {{ row.level }} + (row.branch.selected ? \' active\': \'\')" class="tree-grid-row">\n' +
    '       <td class="role-checkbox-tree-node" style="width:5%;" ng-if="checkboxTree">\n' +
    '         <input class="node-control" name="nodeControl" type="checkbox" ng-model="row.branch.selected" ng-click="onSelect(row, row.branch.selected)" />\n' +
    '       </td>\n' +
    '       <td>\n' +
    '           <a ng-click="(row.branch.children.length) ? onBranchToggle(row) : \'\'" class="tree-branch-anchor">\n' +
    '              <i ng-class="row.tree_icon" ng-style="{\'position\': \'relative\', \'left\': row.styling.indentation + \'px\', \'width\': \'15px\'}"></i>\n' +
    '           </a>' +
    '           <span class="tree-label" ng-click="onRowClick($event, row.branch)"\n' +
    '             ng-style="{\'position\': \'relative\', \'left\': row.styling.text_indent + \'px\'}">\n' +
    '             {{row.branch[expandingProperty.field] || row.branch[expandingProperty]}}\n' +
    '           </span>\n' +
    '       </td>\n' +
    '       <td ng-repeat="col in colDefinitions">\n' +
    '         <div ng-if="col.cellTemplate" compile="col.cellTemplate"></div>\n' +
    '         <div ng-if="!col.cellTemplate">{{row.branch[col.field]}}</div>\n' +
    '       </td>\n' +
    '     </tr>\n' +
    '   </tbody>\n' +
    ' </table>\n' +
    '</div>\n' +
    '');

  $templateCache.put("template/list/angularCheckBoxTreeList.html",
    '<ul class="nav nav-list nav-pills nav-stacked list-tree">\n' +
    ' <li ng-repeat="row in treeRows | filter:{visible:true} track by row.uid" \n' +
    '   ng-class="\'level-\' + {{ row.level }} + (row.branch.selected ? \'active\': \'\')">\n' +
    '   <a ng-click="(row.branch.children.length) ? onBranchToggle(row) : \'\'">\n' +
    '     <i ng-class="row.tree_icon" class="indented tree-icon"></i>\n' +
    '     <span class="indented tree-label" ng-click="onRowClick($event, row.branch)">{{ row.branch[expandingProperty.field] || row.branch[expandingProperty] }}</span>\n' +
    '   </a>\n' +
    ' </li>\n' +
    '</ul>\n' +
    '');
}