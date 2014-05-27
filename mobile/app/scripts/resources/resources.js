'use strict';

angular.module('Afrikik')
  .factory('config', function(envConfiguration) {
    var conf = envConfiguration[envConfiguration.default];
    console.log(envConfiguration.default)
    return {
      apiDir: (envConfiguration.default=='standalone'?'./images/': conf.host + conf.port+'/uploads/')
    };
  })
  
  .factory('Member',['$resource', 'envConfiguration', 'TokenHandler', function members($resource, envConfiguration, TokenHandler) {
    var config = envConfiguration[envConfiguration.default];
    
    var memberServiceUrl = config.host +  ":port/" + config.api_base_version + '/users/:id';
   	
    var memberResource = $resource (memberServiceUrl,
    	{
    		id:'@_id',
    		port: config.port
    	},
    	{
    		update: { method: 'PUT' },
		'get': {method:'GET', isArray: false}
    	}
    );
    
    memberResource = TokenHandler.wrapActions(memberResource,["get","query","update","save"]);
    
    return memberResource;
   
  }])
  
  .factory('Player',['$resource', 'envConfiguration', 'TokenHandler', function players($resource, envConfiguration, TokenHandler) {
    var config = envConfiguration[envConfiguration.default];
    
    var playerServiceUrl = config.host +  ":port/" + config.api_base_version + '/players/:id';
   	
    var playerResource = $resource (playerServiceUrl,
    	{
    		id:'@_id',
    		port: config.port
    	},
    	{
    		update: { method: 'PUT' },
		'get': {method:'GET', isArray: false}
    	}
    );
    
    playerResource = TokenHandler.wrapActions(playerResource,["get","query","update","save"]);
    
    return playerResource;
   
  }])
  
  .factory('Team',['$resource', 'envConfiguration', 'TokenHandler', function posts($resource, envConfiguration, TokenHandler) {
    var config = envConfiguration[envConfiguration.default];
    
    var teamServiceUrl = config.host +  ":port/" + config.api_base_version + '/teams/:id';
   	
    var teamResource = $resource (teamServiceUrl,
    	{
    		id:'@_id',
    		port: config.port
    	},
    	{
    		update: { method: 'PUT' }
    	}
    );
    
    teamResource = TokenHandler.wrapActions(teamResource,["get","query","update","save"]);
    
    return teamResource;
   
  }])
  
  .factory('Search',['$resource', 'envConfiguration', 'TokenHandler', function posts($resource, envConfiguration, TokenHandler) {
    var config = envConfiguration[envConfiguration.default];
    
    var searchServiceUrl = config.host +  ":port/" + config.api_base_version + '/search/:name';
   	
    var searchResource = $resource(searchServiceUrl,
    	{
    		name:'@name',
    		port: config.port
    	}
    );
    
    searchResource = TokenHandler.wrapActions(searchResource,["query"]);
    
    return searchResource;
   
  }]);