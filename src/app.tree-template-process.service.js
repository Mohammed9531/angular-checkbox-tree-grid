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

ngTreeTemplatesService.$inject = ["NgCheckboxTreeTemplateProvider"];

function ngTreeTemplatesService(NgCheckboxTreeTemplateProvider) {

  // {jshint} complains about possible strict violation
  // adding this line below skips the validation 
  /*jshint validthis: true */

  var self = this;

  this.getTemplate = function() {
    var gridType = NgCheckboxTreeTemplateProvider.getGridConfig()['gridType'] || "checkboxGrid";
    return self.getTemplatePath(gridType);
  };

  this.getTemplatePath = function(path) {
    var paths = {};
    paths.listGrid = "template/list/angularCheckBoxTreeList.html";
    paths.checkboxGrid = "template/grid/angularCheckBoxTreeGrid.html";
    return paths[path];
  };
}