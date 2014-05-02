'use strict';

angular.module('nouchiapiApp')
  .filter('localDate',[function () {
    return function (dateInput) {
      return moment(dateInput).fromNow()
    };
  }]);
