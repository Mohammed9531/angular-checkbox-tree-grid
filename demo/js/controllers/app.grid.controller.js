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

    $scope.expanding_property = {
      field: "name",
      displayName: "label.organizations"
    };

    $scope.gridConfig = {
      checkboxTree: true,
      childrenKeyName: 'children',
      iconCollapse: "fa fa-angle-down",
      iconExpand: "fa fa-angle-right"
    };

    // binding
    $scope.dummyTree = [{
      "id": 40,
      "name": "test40",
      "children": [],
      "selected": true
    }, {
      "id": 13,
      "name": "test13",
      "children": [],
      "selected": true
    }];

    $scope.dummyBranch = function(test) {
      debugger;
    }

    // watcher to make sure changes are captured
    $scope.$watch('dummyTree', function(n, o) {
      console.log("New value:", n);
    }, true);

    // test data
    $scope.dummyTreeData = [{
      "id": 10,
      "name": "test10",
      "children": [{
        "id": 11,
        "name": "test11",
        "children": [{
          "id": 12,
          "name": "test12",
          "children": [{
            "id": 14,
            "name": "test14",
            "children": [{
              "id": 16,
              "name": "test16",
              "children": []
            }, {
              "id": 17,
              "name": "test17",
              "children": []
            }]
          }, {
            "id": 15,
            "name": "test15",
            "children": []
          }]
        }, {
          "id": 13,
          "name": "test13",
          "children": []
        }]
      }, {
        "id": 20,
        "name": "test20",
        "children": []
      }, {
        "id": 30,
        "name": "test30",
        "children": []
      }]
    }, {
      "id": 40,
      "name": "test40",
      "children": []
    }];
  }
})();