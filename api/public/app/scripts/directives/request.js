'use strict';

angular.module('nouchiapiApp')
  .directive('request',[ function () {
    return {
      templateUrl: '/app/views/partials/request.html',
      restrict: 'E',
      replace:false,
      link: function postLink(scope, element, attrs) {
        
      }
    };
  }]);
