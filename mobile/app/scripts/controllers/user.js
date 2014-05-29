'use strict';

angular.module('Afrikik')
  .controller('UserCtrl',['$scope','user', function ($scope, user) {
  	$scope.user= user;
    
  }]);
