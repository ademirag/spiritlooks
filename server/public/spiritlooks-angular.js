if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  }
}




var spiritLooksApp = angular.module('spiritlooksApp', ['ngAnimate']);

var serverAppSettings = angular.fromJson(angular.element('<textarea />').html(appSettings).text());

spiritLooksApp.factory('search',function($http,$location,$animate){
    var service = Object()

    service.search = function(scope){
      if(serverAppSettings.ajaxMode == true){

        $location.url('q='+scope.q+'&f='+service.filters(scope));

        var loadIndicator = angular.element(document.getElementById("loading"));
        loadIndicator.removeClass("ng-hide");

        var cont = angular.element(document.getElementById("result"));
        cont.html("");

        if(scope.section == "main"){
            var filter = angular.element(document.getElementById("filter"));
            filter.addClass("ng-hide");
        }

        $http.get("search?q="+scope.q+'&f='+service.filters(scope))
            .then(function(response) {

              if(response.data.error == 0){

                service.fillResult(response.data.result);

                loadIndicator.addClass("ng-hide");

                if(scope.section == "index"){

                  var main = angular.element(document.getElementById("main"));

                  main.scope().q = scope.q;

                  $animate.removeClass(main,"ng-hide");

                }else if(scope.section == "main"){

                  filter.removeClass("ng-hide");

                }

              }
            });
      }else{
        window.location = '/?q='+scope.q+'&f='+service.filters(scope);
      }
    }

    service.fillResult = function(result){
      var cont = angular.element(document.getElementById("result"));
      for(var i = 0; i < result.length; i++){
        var html = "<div>";
        html += "<h1>"+result[i].title+"</h1>";
        html += "<p>"+result[i].abstract+"</p>";
        html += "<h2>"+result[i].link+"</h2>";
        html += "</div>";
        cont.append(html);
      }
    }

    service.filters = function(scope){
      if(scope.section == "index") return "all";

      for(var i = 0; i < scope.filters.length; i++){
        var handles = scope.filters[i].find("a");
        for(var j = 0; j < handles.length; j++){
          var handle = angular.element(handles[j]);
          if(handle.hasClass("solo")){
            if(handle.hasClass("selected")){
              return handle.attr("data-id");
            }
          }
        }
      }

      return scope.filtersValue.join(',');

    }

    return service;
});

spiritLooksApp.controller('spiritlooksIndexController', ['$scope','search','$timeout','$animate',function($scope,search,$timeout,$animate) {

    $scope.section = "index";

    $scope.visible = true;

    if(query){
      $scope.q = angular.element('<textarea />').html(query).text();
    } else {
      $scope.q = "";
    }
    $scope.element = angular.element(document.querySelector('#index'));

    function doSearch(){

      if($scope.q.trim() == "") return;

      if(serverAppSettings.ajaxMode == true){
        $animate.addClass($scope.element,"ng-hide");

        $timeout(function(){
          search.search($scope);
        },500);
      }else{
        search.search($scope);
      }

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

spiritLooksApp.controller('spiritlooksMainController', ['$scope','search',function($scope,search) {

  $scope.section = "main";
  $scope.filtersValue = [];

  if(query){
    $scope.q = angular.element('<textarea />').html(query).text();
  } else {
    $scope.q = "";
  }

  $scope.filters = [];

  if(result){
    search.fillResult(angular.fromJson(angular.element('<textarea />').html(result).text()));
  }

  function doSearch(){

    if($scope.q.trim() == "") return;

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

    if(el.hasClass("selected")){

      if(this.filtersValue.indexOf(el.attr("data-id")) == -1){
        this.filtersValue.push(el.attr("data-id"));
      }

      var selectedCount = 0;
      for(var i = 0; i < this.filters.length; i++){
        var handles = this.filters[i].find("a");
        for(var j = 0; j < handles.length; j++){
          var handle = angular.element(handles[j]);
          if(handle.hasClass("select")){
            if(handle.hasClass("selected")){
              selectedCount++;
            }
          }
        }
        if(selectedCount == this.filters.length){
          angular.element(document.getElementById("selectAllHandle")).addClass("selected");
        }
      }
    }else{
      var ind = this.filtersValue.indexOf(el.attr("data-id"));
      if(ind != -1){
        this.filtersValue.splice(ind, 1);
      }

      angular.element(document.getElementById("selectAllHandle")).removeClass("selected");
    }

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
      angular.element(document.getElementById("selectAllHandle")).addClass("disabled");
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
      angular.element(document.getElementById("selectAllHandle")).removeClass("disabled");
    }
  }

  $scope.onSelectAll = function(e){
    e.preventDefault();
    var el = angular.element(e.target);

    if(el.hasClass("disabled")) return;

    toggle(el);

    this.filtersValue = [];

    if(el.hasClass("selected")){
      for(var i = 0; i < this.filters.length; i++){
        var handles = this.filters[i].find("a");
        for(var j = 0; j < handles.length; j++){
          var handle = angular.element(handles[j]);
          if(handle.hasClass("select")){
            handle.addClass("selected");
            this.filtersValue.push(handle.attr("data-id"));
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
            handle.removeClass("selected");
          }
        }
      }
    }
  }

}]  );

spiritLooksApp.directive("spiritLooksFilter",function(){

  return {
        restrict : "E",
        template : function(element,attr){
          var filterWord = element.html();
          var keyword = element.attr("keyword");
          return '<div class="filterItem"><a href="#" class="select" ng-click="onSelectClick($event)" data-id="'+keyword+'"></a><a class="solo" data-id="'+keyword+'" ng-click="onSoloClick($event)" href="#"></a><span class="keyword">'+filterWord+'</span></div>';
        },
        link:function(scope,element,attr){
          scope.filters.push(angular.element(element));
        }

    };
});

spiritLooksApp.directive("spiritLooksFilterAll",function(){

  return {
        restrict : "E",
        template : function(element,attr){
          return '<div class="filterItem"><a id="selectAllHandle" href="#" class="select" ng-click="onSelectAll($event)"></a></div>';
        }

    };
});
