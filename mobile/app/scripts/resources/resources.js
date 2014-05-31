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
  
  .factory('Player',['$resource', 'envConfiguration', 'TokenHandler','Global', function players($resource, envConfiguration, TokenHandler, Global) {
    var config = envConfiguration[envConfiguration.default];
    
    var playerServiceUrl = config.host +  ":port/" + config.api_base_version + '/players/:id';
   	
    var playerResource = $resource (playerServiceUrl,
    	{
    		id:'@_id',
    		port: config.port
    	},
    	{
    		update: { method: 'PUT' },
		'get': {method:'GET', isArray: false, cache:false},
		'comment': {
		  method:'POST',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/players/:playerId/comment',
		  params:{
		    id : Global.getUserId()		    
		  },
		  isArray:false
		},
		'subscribe':{
		  method: 'POST',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/subscribe/players/:playerId',
		  params:{
		    id : Global.getUserId()		  
		  },
		  isArray:false
		}
    	}
    );
    
    playerResource = TokenHandler.wrapActions(playerResource,["get","query","update","save","comment"]);
    
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
  
  .factory('Activity',['$resource', 'envConfiguration', 'TokenHandler','Global', function activities($resource, envConfiguration, TokenHandler, Global) {
    var config = envConfiguration[envConfiguration.default];
    
    var playerServiceUrl = config.host +  ":port/" + config.api_base_version + '/users/:id/feeds/:feedId';
   	
    var playerResource = $resource (playerServiceUrl,
    	{
    		id:'@_id',
    		port: config.port
    	},
    	{
    		update: { method: 'PUT' },
		'get': {method:'GET', isArray: false},
		'comment': {
		  method:'POST',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/players/:playerId/comment',
		  params:{
		    id : Global.getUserId(),		    	  
		  },
		  isArray:false
		},
		'feedsPlayer':{
		  method:'GET',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/players/:playerId/feeds',
		  params:{
		    id : Global.getUserId(),		    	  
		  },
		  isArray:true
		},
		'feedsSubscribed':{
		  method:'GET',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/feeds',
		  params:{
		    id : Global.getUserId(),		    	  
		  },
		  isArray:true
		},
		'commentsFriends':{
		  method:'GET',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/friends/comments',
		  params:{
		    id : Global.getUserId(),		    	  
		  },
		  isArray:true
		}
    	}
    );
    
    playerResource = TokenHandler.wrapActions(playerResource,["get","query","update","save","comment"]);
    
    return playerResource;
   
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