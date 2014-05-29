'use strict';

angular.module('Afrikik')
  .directive('request',[ function () {
    return {
      templateUrl: '/app/views/partials/request.html',
      restrict: 'E',
      replace:false,
      link: function postLink(scope, element, attrs) {
        
      }
    };
  }]);
