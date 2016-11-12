(function () {
'use strict';

angular.module('MenuListApp', [])
.controller('MenuListController', MenuListController)
.service('MenuListService', MenuListService)
.directive('menuList', MenuListDirective)
.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com");
function MenuListDirective(){
  var ddo={
    templateUrl: 'foundItems.html',
    scope: {
     myMenu: '=myMenu',
     foundItems:'=',
     title: '@title',
     removeItem:'&',
     onRemove:'&'
   }
  }
  return ddo;
}

MenuListController.$inject = ['MenuListService'];
function MenuListController(MenuListService) {
  var menu = this;
  menu.menuList='';
  menu.title="List of Menu Items";
  menu.getMenuList=function(filterStr){
  var promise=MenuListService.getMenuList(filterStr);
  promise.then(function(response){
    menu.menuList = response.data;
    menu.found=[];
    menu.found=MenuListService.getFilteredMenuList(menu.menuList,filterStr);
    //menu in menu.menuList.menu_items
    var menuItems=menu.menuList.menu_items;
    })
    .catch(function(){
      console.log("Something went terribly wrong.");
    })
  }
  menu.removeItem=function(index){
    MenuListService.removeItem(index);
  }
}
MenuListService.$inject = ['$http', 'ApiBasePath'];
function MenuListService($http, ApiBasePath) {
  var service = this;
  var filteredMenuList=[];
  var fullMenuList=[];
  service.getMenuList = function (filterStr) {
  var response = $http({
    method: "GET",
    url: (ApiBasePath + "/menu_items.json")
  });
  return response;
  };
  service.getFilteredMenuList=function(menuListObj, filterStr){
  fullMenuList=menuListObj.menu_items; //219 elemets
    for(var i=0;i<fullMenuList.length;i++){
      if((fullMenuList[i].description).indexOf(filterStr) !==-1){
      filteredMenuList.push(fullMenuList[i]);
    }
    }
    return filteredMenuList;
  }
  service.removeItem = function (itemIdex) {
    console.log("remove method::"+ itemIdex);
    filteredMenuList.splice(itemIdex, 1);
  };
}

})();
