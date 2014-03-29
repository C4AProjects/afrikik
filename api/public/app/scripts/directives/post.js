'use strict';

angular.module('nouchiapiApp')
  .directive('post',[ function () {
    return {
      templateUrl: '/app/views/partials/post.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        
      }
    };
  }]);
