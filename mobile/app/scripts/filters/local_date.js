'use strict';

angular.module('Afrikik')
  .filter('localDate',[function () {
    return function (dateInput) {
      return moment(dateInput).fromNow()
    };
  }]);
