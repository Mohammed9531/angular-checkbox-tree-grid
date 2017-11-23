/**
 * angular-checkbox-tree-grid.js v1.0.1
 * --------------------------------------------------------------------
 *
 * AngularJS Checkbox Tree Gird Directive
 * @author Shoukath Mohammed <mshoukath.uideveloper@gmail.com>
 *
 * Copyright (C) 2016
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

 ;(function() {
"use strict";

/**
 * @ngdoc module
 * @name ngCheckboxTreeGrid
 * @requires angular-checkbox-tree-grid
 * 
 * @description
 * Provides checkbox tree grid functionality.
 * 
 * @example
 */
angular
  .module('ngCheckboxTreeGrid', [
    'angular-checkbox-tree-grid'
  ]);
 

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
 
 

/**
 * @ngdoc factory
 * @name NgTreeDataFactory
 *
 * @module ngCheckboxTreeGrid
 *
 * @description
 * Factory that processes the grid data
 */
angular
  .module("ngCheckboxTreeGrid")
  .factory("NgTreeDataFactory", ngTreeDataFactory);

function ngTreeDataFactory() {

  var DataFactory = function(data) {

    // {jshint} complains about possible strict violation
    // adding this line below skips the validation
    /*jshint validthis: true */

    // adding this line below skips dot notation validation
    /*jshint sub:true*/

    var self = this;
    var fieldName, uid, deselected;

    fieldName = (data.config) 
                ? data.config.childrenKeyName 
                : "children";

    // holds processed grid data
    this.results = [];

    // holds grid configuration
    this.config = data.config;

    // holds grid properties
    this.expandingProperty = data.ep;

    /**
     * @name: processTreeData
     * @methodOf: DataService
     *
     * @param {arr} list of raw data
     * @param {level} number that determines the level of tree data
     * @param {visible} boolean that determines if the object should
     *        be visible, all level-1 objects are visible by default
     * @param {pid} parent id used to look up child nodes
     *
     * @description
     * core method that process all raw data
     *
     * @example
     * [
         {
          "uid": "0.8074930820927302",
          "cid": "c14",
          "branch": {
            "id": 40,
            "name": "India",
            "children": [],
            "selected": true
          },
          "level": 1,
          "visible": true,
          "expanded": false,
          "tree_icon": "",
          "styling": {
            "indentation": "0",
            "text_indent": "20"
          },
          "children": []
        }
      ]
    *
    * @returns
    * list of processed data
    */
    this.processTreeData = function(arr, level, visible, pid) {
      var icon, positioning;
      arr = arr || [];

      // initial level is 1
      level = level || 1;

      // initial visibility is true
      visible = angular.isDefined(visible) ? visible : true;

      for (var i = 0; i < arr.length; i++) {

        // creates a unique id string for template rendering
        uid = "" + Math.random();

        // base positioning for child nodes
        positioning = (20 * (level - 1));

        // checks if item contains nested data and
        // determines icon for the same
        icon = self.treeIconController(arr[i], level, 'iconExpand');

        // push processed data to results list
        self.results.push({
          pid: pid,
          uid: uid,
          cid: 'c' + (11 * level + i),
          branch: arr[i],
          level: level,
          visible: visible,
          expanded: false,
          tree_icon: icon,
          styling: {
            indentation: (level > 1) ? "" + positioning : "0",
            text_indent: (icon === "") ? ("" + (positioning + 20)) : "" + positioning
          }
        });

        // check if each object contains children
        // run recursive loop if object contains children
        if (angular.isArray(arr[i][fieldName]) && arr[i][fieldName].length) {
          self.processTreeData(arr[i][fieldName], (level + 1), false, uid);
        }
      }

      // bind child nodes to each object so it can be
      // consumed in other parts of the service
      self.attachChildNodes(self.results);

      // return processed list
      return self.results;
    };

    // flatten array
    this.flattenTreeData = function(arr) {
      var newArr = [];

      var flatten = function(arr) {
        for (var i = 0; i < arr.length; i++) {
          newArr.push(arr[i]);

          if (arr[i][fieldName].length) {
            flatten(arr[i][fieldName]);
          }
        }
      }
      flatten(arr);
      return newArr;
    };

    /**
     * @name: attachChildNodes
     * @methodOf: DataService
     *
     * @param {arr} list of processed data
     *
     * @description
     * Takes the list of processed nodes and binds
     * their children to it
     *
     * @example
     * [
         {
          "uid": "0.8074930820927302",
          "cid": "c14",
          "branch": {},
          "level": 1,
          "visible": true,
          "expanded": false,
          "tree_icon": "",
          "styling": {
            "indentation": "0",
            "text_indent": "20"
          },
          "children": []
        }
      ]
    */
    this.attachChildNodes = function(arr) {
      angular.forEach(arr, function(o, i) {
        arr[i].children = self.getChildNodes(arr, arr[i].uid) || [];
      });
    };

    /**
     * @name: onDataChange
     * @methodOf: DataService
     *
     * @param {newArr} updated data
     * @param {oldArr} old data
     *
     * @description
     * $watch callback method
     */
    this.onDataChange = function(newArr, oldArr) {
      self.results = [];
      self.processTreeData(newArr);
    };

    /**
     * @name: onBranchChange
     * @methodOf: DataService
     *
     * @param {arr} list of processed data
     * @param {filter} boolean to look up nodes
     *
     * @description
     * returns all selected or deselected nodes based on the
     * filter param being passed. It returns deselected nodes
     * if filter value has not been passed on a function call
     *
     * @returns
     * selected/deselected nodes based on the filter type
     */
    this.onBranchChange = function(arr, filter) {
      return arr.filter(function(c) {
        return (angular.isDefined(filter) && filter) ? c.branch.selected : !c.branch.selected;
      });
    };

    /**
     * @name: onToggle
     * @methodOf: DataService
     *
     * @param {row} current object
     * @param {arr} list of processed data
     *
     * @description
     * Makes all child nodes visible/invisible on
     * row toggle, runs a recursive loop if the
     * current object has children
     */
    this.onToggle = function(row, arr) {
      angular.forEach(arr, function(o, i) {
        if (!angular.isUndefined(arr[i].pid) && arr[i].pid == row.uid) {
          arr[i].visible = row.expanded;

          if (!row.expanded && arr[i].expanded) {
            arr[i].expanded = false;
          }

          if (arr[i].children.length) {
            self.onToggle(arr[i], arr);
          }
        }
      });
    };

    /**
     * @name: onRootSelect
     * @methodOf: DataService
     *
     * @param {selection} boolean that determines if
     *        the root node is checked or not.
     *
     * @description
     * selects/deselects all nodes based on current value.
     * if the selection is 'True' select all nodes
     * if the selection is 'False' deselect all nodes
     */
    this.onRootSelect = function(selection) {
      for (var i = 0; i < self.results.length; i++) {
        self.results[i].branch.selected = selection;
      }
    };

    /**
     * @name: reduceTreeData
     * @methodOf: DataService
     *
     * @description
     * takes all processed nodes and returns the branches of
     * all selected nodes.
     *
     * @returns
     * a new array of selected branches
     */
    //TODO: Needs refactoring
    this.reduceTreeData = function() {
      return self.onBranchChange(self.results, true).map(function(o) {
        return o.branch;
      });
    };

    /**
     * @name: onSelect
     * @methodOf: DataService
     *
     * @param {row} current object node
     * @param {selection} boolean that determines if the
     *        current node is selected or not
     * @param {individualSelect} flag that prevents child
     *        nodes from selection.
     *
     * @description
     * this method gets called when a checkbox is checked,
     * it checks if individual selection is enabled and in
     * case of individual selection being turned off, it
     * selects all child nodes of the current row object.
     * It also runs a recursive loop until the nested items
     * are checked
     */
    this.onSelect = function(row, selection, individualSelect) {
      if (!individualSelect) {
        self.checkChildNodes(row, selection);
        self.updateNodesCheck(row.level, self.results);
      }
    };

    /**
     * @name: getDeselectedNodes
     * @methodOf: DataService
     *
     * @description
     * filters out all desected nodes
     *
     * @returns
     * list of deselected nodes
     */
    this.getDeselectedNodes = function() {
      return self.onBranchChange(self.results, false);
    };

    /**
     * @name: isRootNodeSelected
     * @methodOf: DataService
     *
     * @description
     * checks if all nodes or selected or deselected
     *
     * @returns
     * True -  if all selected
     * False - if any deselected node exists
     */
    this.isRootNodeSelected = function() {
      var dn = self.getDeselectedNodes();
      var rnv = angular.isArray(dn) && dn.length ? false : true;
      return rnv;
    };

    /**
     * @name: getTreeModel
     * @methodOf: DataService
     *
     * @description
     * takes all processed nodes and returns
     * all selected nodes.
     *
     * @returns
     * list of selected nodes
     */
    this.getTreeModel = function() {
      return self.onBranchChange(self.results, true);
    };

    /**
     * @name: checkChildNodes
     * @methodOf: DataService
     *
     * @param {row} current object node
     * @param {selection} boolean that determines if the
     *        current node is selected or not
     * @param {individualSelect} flag that prevents child
     *        nodes from selection.
     *
     * @description
     * this method gets called when a checkbox is checked,
     * it checks if individual selection is enabled and in
     * case of individual selection being turned off, it
     * selects all child nodes of the current row object.
     * It also runs a recursive loop until the nested items
     * are checked
     */
    this.checkChildNodes = function(row, selection) {
      for (var i = 0; i < self.results.length; i++) {
        if (self.results[i].pid == row.uid) {
          self.results[i].branch.selected = selection;

          if (self.results[i].branch[fieldName].length) {
            self.checkChildNodes(self.results[i], selection);
          }
        }
      }
    };

    /**
     * @name: getNodes
     * @methodOf: DataService
     *
     * @param {arr} list of processed data
     * @param {level} number that determines tree data level
     *
     * @description
     * a method to look up nodes based on the level
     */
    this.getNodes = function(arr, level) {
      return arr.filter(function(c) {
        return c.level == level;
      });
    };


    // TODO: Needs refactoring
    this.getProcessedData = function() {
      var arr = self.results || [];

      if (arr.length) {
        return arr.map(function(obj) {
          return obj.branch;
        });
      }
      return arr;
    };

    /**
     * @name: recursiveCheck
     * @methodOf: DataService
     *
     * @param {arr} list of processed data
     * @param {level} number that determines tree data level
     *
     * @description
     * this method gets called when a checkbox is checked,
     * it selects the parent node if all child nodes are
     * selected. Runs recursively until all nested list items
     * are checked
     */
    this.recursiveCheck = function(arr, level) {

      level = level || 1;
      var nodes = self.getNodes(arr, level);
      for (var i = 0; i < nodes.length; i++) {
        var children = self.getChildNodes(arr, nodes[i].uid) || [];
        if (children.length) {
          nodes[i].branch.selected = children.every(self.allSelected);

          // perform check on selected attribute
          for (var j = 0; j < children.length; j++) {
            if (children[j].branch[fieldName].length) {
              self.recursiveCheck(arr, (level + 1));
            }
          }
        }
      }
    };

    /**
     * @name: updateNodesCheck
     * @methodOf: DataService
     *
     * @param {arr} list of processed data
     * @param {level} number that determines tree data level
     *
     * @description
     * this method gets called when a checkbox is checked,
     * it selects the parent node if all child nodes are
     * selected. Runs recursively until all nested list items
     * are checked
     */
    this.updateNodesCheck = function(level, arr) {
      while (level > 0) {
        self.recursiveCheck(arr, level);
        level--;
      }
    };

    /**
     * @name: getChildNodes
     * @methodOf: DataService
     *
     * @param {arr} list of processed data
     * @param {uid} unique id string
     *
     * @description
     * a method to look up child nodes
     */
    this.getChildNodes = function(arr, uid) {
      return arr.filter(function(c) {
        return c.pid == uid;
      });
    };

    /**
     * @name: allSelected
     * @methodOf: DataService
     *
     * @param {item} current item/object
     *
     * @description
     * checks if all nodes are selected or not
     *
     * @returns
     * True - if all checked/selected
     * False - if deselected nodes exist
     */
    this.allSelected = function(item) {
      return item.branch.selected;
    };

    // deprecated
    // TODO: Needs refactoring
    this.onChildSelection = function(a, b) {
      if (angular.isArray(b) && b.length) {
        for (var i = 0; i < a.length; i++) {
          for (var j = 0; j < b.length; j++) {
            if (b[j].level > 1 && b[j].pid == a[i].uid) {
              a[i].branch.selected = b[j].branch.selected;
            }
          }
        }
      }
    };

    /**
     * @name: onBranchToggle
     * @methodOf: DataService
     *
     * @param {row} current object node
     *
     * @description
     * core method that determines the icon type
     * based on row expand or collapse
     *
     * @example
     * [
         {
          "uid": "0.8074930820927302",
          "cid": "c14",
          "branch": {},
          "level": 1,
          "visible": true,
          "expanded": false,
          "tree_icon": "fa fa-angle-right",
          "styling": {
            "indentation": "0",
            "text_indent": "20"
          },
          "children": []
        },
        {
          "uid": "0.8074930820927302",
          "cid": "c14",
          "branch": {},
          "level": 1,
          "visible": true,
          "expanded": true,
          "tree_icon": "fa fa-angle-down",
          "styling": {
            "indentation": "0",
            "text_indent": "20"
          },
          "children": []
        }
      ]
    */
    this.onBranchToggle = function(row) {
      var icon = "";
      if (row.children.length) {
        row.expanded = !row.expanded;

        icon = (row.expanded) ? 'iconCollapse' : 'iconExpand';
        row.tree_icon = self.treeIconController(row.branch, row.level, icon);
        self.onToggle(row, self.results);
      }
    };

    // deprecated
    //TODO: Needs refactoring
    this.onTreeDataChange = function(n, o) {
      return self.onBranchChange(n, true);
    };

    /**
     * @name: onTreeModelChange
     * @methodOf: DataService
     *
     * @param {n} updated data
     * @param {o} old data
     *
     * @description
     * $watch callback method, gets called
     * on model data change
     */
    this.onTreeModelChange = function(n, o) {
      if (angular.isArray(n)) {
        for (var i = 0; i < n.length; i++) {
          for (var j = 0; j < self.results.length; j++) {
            if (n[i][self.expandingProperty['field']] ==
              self.results[j].branch[self.expandingProperty['field']]) {
              self.results[j].branch.selected = n[i].selected;
            }
          }
        }
      }
    };

    /**
     * @name: clearAllSelectedNodes
     * @methodOf: DataService
     *
     * @param {arr} list of processed data
     *
     * @description
     * clear all selected nodes in case if the
     * grid type is changed
     */
    this.clearAllSelectedNodes = function(arr) {
      if (angular.isArray(arr)) {
        for (var i = 0; i < arr.length; i++) {
          delete arr[i].selected;

          if (arr[i][fieldName].length) {
            self.clearAllSelectedNodes(arr[i][fieldName]);
          }
        }
        return arr;
      }
      return [];
    };

    /**
     * @name: highlightSelectedNode
     * @methodOf: DataService
     *
     * @param {e} trigged event (click)
     * @requires: "highlighSelected"
     *
     * @description
     * removes highlighted class if already exits
     * on element scope and checks if the current
     * element is a <td> and adds highlighted class
     * to the parent element.
     */
    this.highlightSelectedNode = function(e) {
      var el = angular.element(e.currentTarget).parent()[0];

      // check if the current node name is "TD"
      // find the parent node to apply styling
      if (el.nodeName == "TD") {
        el = angular.element(el.parentNode);
      }
      // remove highlighted class if exts
      this.find('.highlighted').removeClass('highlighted');

      // add highlighted class tot he current element
      el.addClass("highlighted");
    };

    /**
     * @name: treeIconController
     * @methodOf: DataService
     *
     * @param {item} current item/object
     * @param {level} number that determines tree data level
     * @param {iconType} iconExpand or iconCollapse
     *
     * @description
     * icon wrapper that helps define individual icons for each
     * tree levels.
     *
     * @returns
     * icons to display
     */
    this.treeIconController = function(item, level, iconType) {
      var icon = "";

      if (item && angular.isArray(item[fieldName]) && item[fieldName].length) {
        // get icon type from grid config
        var _iconType = self.config[iconType];

        // check if iconType is an object or string
        if (angular.isObject(_iconType)) {
          icon = _iconType["level_" + level] || _iconType["level_1"];
        } else {
          icon = _iconType;
        }
      } else {
        icon = self.config.iconIndividual || "";
      }
      return icon;
    };
  };

  var init = function(data) {
    return new DataFactory(data);
  };

  return {
    init: init
  };
}
 

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
 
 

/**
 * @ngdoc service
 * @name NgTreeTemplatesService
 * @requires NgCheckboxTreeTemplateProvider
 *
 * @module ngCheckboxTreeGrid
 *
 * @description
 * Allows user to set the template path
 */
angular
  .module("ngCheckboxTreeGrid")
  .service("NgTreeTemplatesService", ngTreeTemplatesService);

ngTreeTemplatesService.$inject = ["NgCheckboxTree"];

function ngTreeTemplatesService(NgCheckboxTree) {

  // {jshint} complains about possible strict violation
  // adding this line below skips the validation 
  /*jshint validthis: true */

  // adding this line below skips dot notation validation
  /*jshint sub:true*/

  var self = this;

  this.getTemplate = function() {
    var gridType = NgCheckboxTree.getGridConfig()['gridType'];
    return self.getTemplatePath(gridType);
  };

  this.getTemplatePath = function(path) {
    var paths = {};
    paths.listGrid = "template/list/angularCheckBoxTreeList.html";
    paths.checkboxGrid = "template/grid/angularCheckBoxTreeGrid.html";
    return paths[path];
  };
}
 

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
 

/**
 * @ngdoc module
 * @name angular-checkbox-tree-grid
 *
 * @description
 * Responsible for storing grid templates
 */
angular.module("angular-checkbox-tree-grid", []);
 

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
}());
