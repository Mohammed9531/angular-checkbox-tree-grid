'use strict';

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