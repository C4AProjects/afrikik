'use strict';

angular.module('nouchiapiApp')
  .controller('UserCtrl',['$scope','user', function ($scope, user) {
  	$scope.user= user;
    
  }]);
