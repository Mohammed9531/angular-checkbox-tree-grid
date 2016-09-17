/**
 *
 */
(function() {
  angular
    .module('template/angularCheckboxTreeGrid/ngCheckBoxTreeGrid.html', [])
    .run([
      '$templateCache',
      function($templateCache) {

        // checkbox grid template
        $templateCache.put('template/treeGrid/checkBoxTreeGrid.html',
          "<div class=\"table-responsive\">\n" +
          " <table class=\"table table-bordered table-striped tree-grid\">\n" +
          "   <thead>\n" +
          "     <tr>\n" +
          "        <th style=\"width:5%;\" ng-if=\"checkboxTree\"><input type=\"checkbox\" ng-change=\"onRootSelect(rootNode)\" ng-model=\"rootNode\" /></th>\n" +
          "       <th>{{expandingProperty.displayName || expandingProperty.field || expandingProperty | translate}}</th>\n" +
          "       <th ng-repeat=\"col in colDefinitions\">{{col.displayName | translate}}</th>\n" +
          "     </tr>\n" +
          "   </thead>\n" +
          "   <tbody>\n" +
          "     <tr ng-repeat=\"row in tree_rows | filter:{visible:true} track by row.uid\"\n" +
          "       ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? ' active':'')\" class=\"tree-grid-row\">\n" +
          "       <td class=\"role-checkbox-tree-node\" style=\"width:5%;\" ng-if=\"checkboxTree\">\n" +
          "         <input class=\"node-control\" name=\"nodeControl\" type=\"checkbox\" ng-model=\"row.branch.selected\" ng-click=\"onSelect(row, row.branch.selected)\" /></td>" +
          "       <td><a ng-click=\"onBranchToggle(row)\" class=\"tree-branch-anchor\"><i ng-class=\"row.tree_icon\"\n" +
          "              class=\"indented\"></i>\n" +
          "           </a><span class=\"indented tree-label\" ng-click=\"onBranchClick({branch: row.branch})\">\n" +
          "             {{row.branch[expandingProperty.field] || row.branch[expandingProperty]}}</span>\n" +
          "       </td>\n" +
          "       <td ng-repeat=\"col in colDefinitions\">\n" +
          "         <div ng-if=\"col.cellTemplate\" compile=\"col.cellTemplate\"></div>\n" +
          "         <div ng-if=\"!col.cellTemplate\">{{row.branch[col.field]}}</div>\n" +
          "       </td>\n" +
          "     </tr>\n" +
          "   </tbody>\n" +
          " </table>\n" +
          "</div>\n" +
          "");

        // normal listed tree grid
        $templateCache.put("template/angularCheckboxTreeGrid/ngListTree.html",
          "<ul class=\"nav nav-list nav-pills nav-stacked list-tree\">\n" +
          " <li ng-repeat=\"row in tree_rows | filter:{visible:true} track by row.uid\" \n" +
          "   ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? ' active':'')\">\n" +
          "   <a ng-click=\"(row.branch.children.length) ? onBranchToggle(row) : ''\">\n" +
          "     <i ng-class=\"row.tree_icon\" class=\"indented tree-icon\"></i>\n" +
          "     <span class=\"indented tree-label\" ng-click=\"onBranchClick({branch: row.branch})\">{{ row.branch[expandingProperty.field] || row.branch[expandingProperty] }}</span>\n" +
          "   </a>\n" +
          " </li>\n" +
          "</ul>\n" +
          "");
      }
    ]);
})();