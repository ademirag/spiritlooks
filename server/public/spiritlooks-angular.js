if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  }
}

if(typeof String.prototype.replaceAll !== 'function') {
  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
  };
}

function hashURL(str){
  str = str.replaceAll(' ','-');
  return str;
}

function unhashURL(str){
  str = decodeURIComponent(str);
  str = str.replaceAll('-',' ');
  return str;
}

var doSearchTimeout = 0;

var spiritLooksApp = angular.module('spiritlooksApp', ['ngAnimate']);

var serverAppSettings = angular.fromJson(angular.element('<textarea />').html(appSettings).text());

spiritLooksApp.factory('search',function($http,$location,$animate){
    var service = Object()

    service.search = function(scope){
      if(serverAppSettings.ajaxMode == true){

        var loadIndicator = angular.element(document.getElementById("loading"));
        loadIndicator.removeClass("ng-hide");

        var cont = angular.element(document.getElementById("result"));
        cont.html("");

        if(scope.section == "main"){
            var filter = angular.element(document.getElementById("filter"));
            filter.addClass("ng-hide");
        }

        var filters = service.filters(scope);

        $http.get("search?q="+scope.q+'&f='+filters[0]+'&s='+filters[1])
            .then(function(response) {

              if(response.data.error == 0){

                service.fillResult(response.data.result);

                loadIndicator.addClass("ng-hide");

              //  if(scope.section == "index"){

                  var main = angular.element(document.getElementById("main"));

                  main.scope().q = scope.q;

                  $animate.removeClass(main,"ng-hide");

              //  }else if(scope.section == "main"){
                  if(scope.section == "main"){
                    filter.removeClass("ng-hide");
                  }

                //}

              }
            });
      }else{
        var filters = service.filters(scope);
        window.location = '/?q='+scope.q+'&f='+filters[0]+'&s='+filters[1];
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
      if(scope.section == "index"){
        return [filterStr,""];
      }

      for(var i = 0; i < scope.filters.length; i++){
        var handles = scope.filters[i].find("a");
        for(var j = 0; j < handles.length; j++){
          var handle = angular.element(handles[j]);
          if(handle.hasClass("solo")){
            if(handle.hasClass("selected")){
              return [scope.filtersValue.join(','),handle.attr("data-id")];
            }
          }
        }
      }

      return [scope.filtersValue.join(','),""];

    }

    return service;
});

spiritLooksApp.controller('spiritlooksIndexController', ['$scope','search','$timeout','$animate','$location',function($scope,search,$timeout,$animate,$location) {

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

        doSearchTimeout = 500;

        var filters = search.filters($scope);
        $location.url(hashURL($scope.q)+'/'+filters[0]+'/'+filters[1]);

        /*$timeout(function(){
          search.search($scope);
        },500);*/
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


    $scope.init = function(){
      if(serverAppSettings.ajaxMode){
        var urlOpts = $location.url().split('/');
        if(urlOpts.length >= 3){
          $scope.q = unhashURL(urlOpts[1]);
          search.search($scope);
          $scope.element.remove();
        }
      }else{
        var urlOpts = $location.url().split('/');
        if(urlOpts.length == 4){
          window.location = '/?q='+unhashURL(urlOpts[1])+'&f='+urlOpts[2];
        }
      }
    };

}]);

spiritLooksApp.controller('spiritlooksMainController', ['$scope','search','$location','$interval','$timeout',function($scope,search,$location,$interval,$timeout) {

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
      var filters = search.filters($scope);
      $location.url(hashURL($scope.q)+'/'+filters[0]+'/'+filters[1]);
      doSearch();
    }
  }

  $scope.onSearch = function(e){
    e.preventDefault();
    var filters = search.filters($scope);
    $location.url(hashURL($scope.q)+'/'+filters[0]+'/'+filters[1]);
    doSearch();
  }

  function toggle(el){
    if(el.hasClass("selected")){
      el.removeClass("selected");
    }else{
      el.addClass("selected");
    }
  }

  function doSelect(el){
    if(el.hasClass("selected")){

      if($scope.filtersValue.indexOf(el.attr("data-id")) == -1){
        $scope.filtersValue.push(el.attr("data-id"));
      }

      var selectedCount = 0;
      for(var i = 0; i < $scope.filters.length; i++){
        var handles = $scope.filters[i].find("a");
        for(var j = 0; j < handles.length; j++){
          var handle = angular.element(handles[j]);
          if(handle.hasClass("select")){
            if(handle.hasClass("selected")){
              selectedCount++;
            }
          }
        }
      }
      if(selectedCount == $scope.filters.length){
        angular.element(document.getElementById("selectAllHandle")).addClass("selected");
      }
    }else{
      var ind = $scope.filtersValue.indexOf(el.attr("data-id"));
      if(ind != -1){
        $scope.filtersValue.splice(ind, 1);
      }

      angular.element(document.getElementById("selectAllHandle")).removeClass("selected");
    }


  }

  function doSolo(el){
    if(el.hasClass("selected")){
      for(var i = 0; i < $scope.filters.length; i++){
        var handles = $scope.filters[i].find("a");
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
      for(var i = 0; i < $scope.filters.length; i++){
        var handles = $scope.filters[i].find("a");
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

  $scope.onSelectClick = function(e){
    e.preventDefault();
    var el = angular.element(e.target);
    if(el.hasClass("disabled")) return;
    toggle(el);

    doSelect(el);

    $scope.updateKeywordsHash();

  }

  $scope.onSoloClick = function(e){
    e.preventDefault();
    var el = angular.element(e.target);
    toggle(el);

    doSolo(el);

    $scope.updateKeywordsHash();
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

    $scope.updateKeywordsHash();
  }

  $scope.updateKeywordsHash = function(){
    var filters = search.filters($scope);
    if(serverAppSettings.ajaxMode){
      $location.url(hashURL($scope.q)+'/'+filters[0]+'/'+filters[1]);
    }else{
      window.location = '/?q='+$scope.q+'&f='+filters[0]+'&s='+filters[1];
    }
  }

  function doInitFilter(filter){
    var filterKeywords = filter.split(',');
    var selects = document.getElementsByClassName("select");
    for(var i = 0; i < filterKeywords.length; i++){
      var keyword = filterKeywords[i];
      for(var j = 0; j < selects.length; j++){
        var el = angular.element(selects[j]);
        if(el.attr("data-id") == keyword){
          if(el.hasClass("selected") == false){
            el.addClass("selected");
          }
          doSelect(el);
          break;
        }
      }
    }
  }

  function doInitSolo(solo){
    var solos = document.getElementsByClassName("solo");
    for(var j = 0; j < solos.length; j++){
      var el = angular.element(solos[j]);
      if(el.attr("data-id") == solo){
        if(el.hasClass("selected") == false){
          el.addClass("selected");
        }
        doSolo(el);
        break;
      }
    }
  }

  $scope.init = function(){
    $timeout(function(){

      if(filter){
        doInitFilter(filter);
      }

      if(solo){
        doInitSolo(solo);
      }
    },0);
  };

  var oldHash = hashURL($location.url());

  $interval(function () {
    if(serverAppSettings.ajaxMode == true){
      if(oldHash != hashURL($location.url())){
        var urlOpts = $location.url().split('/');
        if(urlOpts.length >= 3){
          $scope.q = unhashURL(urlOpts[1]);
          if(urlOpts[2]){
            doInitFilter(urlOpts[2]);
          }
          if(urlOpts[3]){
            doInitSolo(urlOpts[3]);
          }
          $timeout(function(){
            doSearch();
          },doSearchTimeout);
          doSearchTimeout = 0;
        }
      }
      oldHash = $location.url();
    }
  }, 100);

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
