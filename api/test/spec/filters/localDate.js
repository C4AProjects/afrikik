'use strict';

describe('Filter: localDate', function () {

  // load the filter's module
  beforeEach(module('nouchiapiApp'));

  // initialize a new instance of the filter before each test
  var localDate;
  beforeEach(inject(function ($filter) {
    localDate = $filter('localDate');
  }));

  it('should return the input prefixed with "localDate filter:"', function () {
    var text = 'angularjs';
    expect(localDate(text)).toBe('localDate filter: ' + text);
  });

});
