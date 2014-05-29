'use strict';

angular.module('Afrikik')
  .directive('post',[ function () {
    return {
      templateUrl: '/app/views/partials/post.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        
      }
    };
  }]);
