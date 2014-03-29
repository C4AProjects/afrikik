'use strict';

describe('Directive: post', function () {
  beforeEach(module('nouchiapiApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<post></post>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the post directive');
  }));
});
