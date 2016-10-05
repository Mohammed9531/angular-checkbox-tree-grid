/**
 * @ngdoc service
 * @name NgTreeGridService
 *
 * @description
 * Process the grid data
 */
angular
  .module("ngCheckboxTreeGrid")
  .service("NgTreeGridService", ngTreeGridService);

function ngTreeGridService() {

  // {jshint} complains about possible strict violation
  // adding this line below skips the validation 
  /*jshint validthis: true */

  // adding this line below skips dot notation validation
  /*jshint sub:true*/

  var self = this;
  var fieldName, uid, deselected;

  this.data = null;

  // grid configuration
  this.results = [];

  this.getData = function() {
    return self.data;
  };

  this.setData = function(data) {
    self.data = data;
  };

  this.setGridConfig = function(config, ep) {
    self.config = config;
    self.expandingProperty = ep;
    fieldName = config.childrenKeyName;
  };

  this.flattenTreeData = function(arr, level, visible, pid) {
    var icon, positioning;
    arr = arr || [];
    level = level || 1;
    visible = angular.isDefined(visible) ? visible : true;

    for (var i = 0; i < arr.length; i++) {
      uid = "" + Math.random();
      positioning = (20 * (level - 1));
      icon = self.treeIconController(arr[i], level, 'iconExpand');

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

      if (angular.isArray(arr[i][fieldName]) && arr[i][fieldName].length) {
        self.flattenTreeData(arr[i][fieldName], (level + 1), false, uid);
      }
    }
    self.attachChildNodes(self.results);
    return self.results;
  };

  // return children of each object
  this.attachChildNodes = function(arr) {
    angular.forEach(arr, function(o, i) {
      arr[i].children = self.getChildNodes(arr, arr[i].uid) || [];
    });
  };

  this.onDataChange = function(newArr, oldArr) {
    self.results = [];
    self.flattenTreeData(newArr);
  };

  this.onBranchChange = function(arr, filter) {
    return arr.filter(function(c) {
      return (angular.isDefined(filter) && filter) ? c.branch.selected : !c.branch.selected;
    });
  };

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

  this.onRootSelect = function(selection) {
    for (var i = 0; i < self.results.length; i++) {
      self.results[i].branch.selected = selection;
    }
  };

  this.reduceTreeData = function() {
    return self.onBranchChange(self.results, true).map(function(o) {
      return o.branch;
    });
  };

  this.onSelect = function(row, selection, callback) {
    self.checkChildNodes(row, selection);
    self.updateNodesCheck(row.level, self.results);
  };

  this.getDeselectedNodes = function() {
    return self.onBranchChange(self.results, false);
  };

  this.isRootNodeSelected = function() {
    var dn = self.getDeselectedNodes();
    var rnv = angular.isArray(dn) && dn.length ? false : true;
    return rnv;
  };

  this.getTreeModel = function() {
    return self.onBranchChange(self.results, true);
  };

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

  this.getNodes = function(arr, level) {
    return arr.filter(function(c) {
      return c.level == level;
    });
  };

  // get parent nodes
  this.recursiveCheck = function(a, level) {

    level = level || 1;
    var nodes = self.getNodes(a, level);
    for (var i = 0; i < nodes.length; i++) {
      var children = self.getChildNodes(a, nodes[i].uid) || [];
      if (children.length) {
        nodes[i].branch.selected = children.every(self.allSelected);

        // perform check on selected attribute
        for (var j = 0; j < children.length; j++) {
          if (children[j].branch[fieldName].length) {
            self.recursiveCheck(a, (level + 1));
          }
        }
      }
    }
  };

  this.updateNodesCheck = function(level, arr) {
    while (level > 0) {
      self.recursiveCheck(arr, level);
      level--;
    }
  };

  this.getChildNodes = function(arr, uid) {
    return arr.filter(function(c) {
      return c.pid == uid;
    });
  };

  this.allSelected = function(elem) {
    return elem.branch.selected;
  };

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

  this.onBranchToggle = function(row) {
    var icon = "";
    if (row.children.length) {
      row.expanded = !row.expanded;

      icon = (row.expanded) ? 'iconCollapse' : 'iconExpand';
      row.tree_icon = self.treeIconController(row.branch, row.level, icon);
      self.onToggle(row, self.results);
    }
  };

  this.onTreeDataChange = function(n, o) {
    return self.onBranchChange(n, true);
  };

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

  this.treeIconController = function(item, level, iconType) {
    var icon = "";

    if (item && item[fieldName].length) {
      if (angular.isObject(self.config[iconType])) {
        icon = self.config[iconType]["level_" + level] || self.config[iconType]["level_1"];
      } else {
        icon = self.config[iconType];
      }
    } else {
      icon = self.config.iconIndividual || "";
    }
    return icon;
  };
}