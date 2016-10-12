/**
 * Author : Shoukath Mohammed
 * Date   : 10/01/2016
 * Time   : 09:00 AM EST
 * Created with Sublime Text
 */
(function() {

  'use strict';

  angular
    .module('gridTree')
    .controller('GridCtrl', GridCtrl);

  GridCtrl.$inject = ['$scope'];

  function GridCtrl($scope) {

    var vm = this;

    vm.expanding_property = {
      field: "name",
      displayName: "Countries"
    };

    vm.gridConfig = {
      iconCollapse: "fa fa-angle-down",
      iconExpand: "fa fa-angle-right",
      highlightSelected: true
    };

    vm.gridConfig1 = angular.extend({}, {
      checkboxTree: true
    }, vm.gridConfig);

    // binding
    vm.dummyTree = [{
      "id": 40,
      "name": "USA",
      "children": [],
      "selected": true
    }, {
      "id": 13,
      "name": "UK",
      "children": [],
      "selected": true
    }];

    vm.dummyBranch = function(test) {
      alert("'" + test.name + "'" + " node is clicked!");
    };

    // watcher to make sure changes are captured
    $scope.$watch('dummyTree', function(n, o) {
      console.log("New value:", n);
    }, true);

    // test data
    var data = [{
      "id": 10,
      "name": "USA",
      "children": [{
        "id": 11,
        "name": "Massachusetts",
        "children": [{
          "id": 12,
          "name": "Boston",
          "children": []
        }, {
          "id": 115,
          "name": "Burlington",
          "children": []
        }, {
          "id": 154,
          "name": "Lowell",
          "children": []
        }]
      }, {
        "id": 13,
        "name": "Illinois",
        "children": [{
          "id": 315,
          "name": "Chicago",
          "children": []
        }, {
          "id": 152,
          "name": "Naperville",
          "children": []
        }]
      }]
    }, {
      "id": 20,
      "name": "India",
      "children": [{
        "id": 165,
        "name": "Andhra Pradesh",
        "children": [{
          "id": 105,
          "name": "Hyderabad",
          "children": []
        }]
      }, {
        "id": 1665,
        "name": "Maharastra",
        "children": [{
          "id": 1105,
          "name": "Mumbai",
          "children": []
        }]
      }]
    }, {
      "id": 30,
      "name": "UK",
      "children": [{
        "id": 1665,
        "name": "London",
        "children": []
      }]
    }, {
      "id": 40,
      "name": "Bangladesh",
      "children": []
    }];
    vm.data = [];
    vm.dummyTreeData = angular.copy(data);
    vm.dummyTreeData1 = angular.copy(data);


    //---------------------------------------//
    //---------------------------------------//

    vm.addNode = function(node) {
      var parentId = angular.fromJson(node.parent);
      var data = angular.extend(node.data, {
        id: Math.floor(Math.random() * 10000),
        children: []
      });

      vm.pushNodes(vm.dummyTreeData1, data, parentId);
      vm.obj = {};
    };

    vm.pushNodes = function(arr, data, parentId) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == parentId) {
          arr[i].children = arr[i].children || [];
          arr[i].children.push(data);
        } else {
          if (arr[i].children.length) {
            vm.pushNodes(arr[i].children, data, parentId);
          }
        }
      }
    };
  }
})();