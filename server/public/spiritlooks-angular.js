var spiritLooksApp = angular.module('spiritlooksApp', []);

spiritLooksApp.factory('search',function(){
    var service = Object()

    service.search = function(scope){

    }

    return service;
});

spiritLooksApp.controller('spiritlooksIndexController', ['$scope','search',function($scope,search) {

    $scope.element = angular.element(document.querySelector('#index'));

    function doSearch(){
      $scope.element.addClass("ng-hide");
      search.search($scope);
    }

    $scope.onQueryKeyDown = function(e){
      if(e.keyCode == 13){
          doSearch();
      }
    }

    $scope.onSearch = function(e){
      e.preventDefault();
      doSearch();
    }

}]);

spiritLooksApp.controller('spiritlooksMainController', function($scope) {
  $scope.filters = [];
  function toggle(el){
    if(el.hasClass("selected")){
      el.removeClass("selected");
    }else{
      el.addClass("selected");
    }
  }
  $scope.onSelectClick = function(e){
    e.preventDefault();
    var el = angular.element(e.target);
    if(el.hasClass("disabled")) return;
    toggle(el);
  }

  $scope.onSoloClick = function(e){
    e.preventDefault();
    var el = angular.element(e.target);
    toggle(el);
    if(el.hasClass("selected")){
      for(var i = 0; i < this.filters.length; i++){
        var handles = this.filters[i].find("a");
        for(var j = 0; j < handles.length; j++){
          var handle = angular.element(handles[j]);
          if(handle.hasClass("select")){
            handle.addClass("disabled");
          }else{
            handle.removeClass("selected");
          }
        }
      }
      el.addClass("selected");
    }else{
      for(var i = 0; i < this.filters.length; i++){
        var handles = this.filters[i].find("a");
        for(var j = 0; j < handles.length; j++){
          var handle = angular.element(handles[j]);
          if(handle.hasClass("select")){
            handle.removeClass("disabled");
          }
        }
      }
    }
  }
// SOLOYU KALDIR ONCEKI SEÇIME DON... SOLO SIRASINDA KUTUCUKLAR DISABLE OLMALI
});

spiritLooksApp.directive("spiritLooksFilter",function(){

  return {
        restrict : "E",
        template : function(element,attr){
          var filterWord = element.html();
          return '<div class="filterItem"><a href="#" class="select" ng-click="onSelectClick($event)"></a><a class="solo" ng-click="onSoloClick($event)" href="#"></a><span class="keyword">'+filterWord+'</span></div>';
        },
        link:function(scope,element,attr){
          scope.filters.push(angular.element(element));
        }

    };
});
