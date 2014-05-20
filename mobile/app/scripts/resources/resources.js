'use strict';

angular.module('Afrikik')
  .factory('config', function(envConfiguration) {
    var conf = envConfiguration[envConfiguration.default];
    console.log(envConfiguration.default)
    return {
      apiDir: (envConfiguration.default=='standalone'?'./images/': conf.host + conf.port+'/uploads/')
    };
  })