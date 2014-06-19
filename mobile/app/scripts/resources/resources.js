'use strict';

angular.module('Afrikik')
  .factory('config', function(envConfiguration) {
    var conf = envConfiguration[envConfiguration.default];
    console.log(envConfiguration.default)
    return {
      apiDir: (envConfiguration.default=='standalone'?'./images/': conf.host + conf.port+'/uploads/')
    };
  })
  
  .factory('Member',['$resource', 'envConfiguration', 'TokenHandler', 'Global', function members($resource, envConfiguration, TokenHandler, Global) {
    var config = envConfiguration[envConfiguration.default];
    
    var memberServiceUrl = config.host +  ":port/" + config.api_base_version + '/users/:id';
   	
    var memberResource = $resource (memberServiceUrl,
    	{
    		id:'@_id',
    		port: config.port
    	},
    	{
		update:{
		  method:'PUT',
		  params:{
		   id:Global.getUserId()
		  },
		  isArray:false
		},
		'get': {method:'GET', isArray: false}
		,
		'subscribe':{
		  method: 'POST',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/subscribe/members/:memberId',
		  params:{
		    id : Global.getUserId()		  
		  },
		  isArray:false
		},
		'unsubscribe':{
		  method: 'POST',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/unsubscribe/members/:memberId',
		  params:{
		    id : Global.getUserId()		  
		  },
		  isArray:false
		}
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
		'get': {
		  method:'GET',
		  params:{
		    id : Global.getUserId()		    
		  },
		  isArray: false,
		  ignoreLoadingBar: true
		},
		'stats': {
		  method:'GET',
		  url: config.host +  ":port/" + config.api_base_version + '/players/:playerId/stats',
		  params:{
		    
		  },
		  isArray: true	    
		},
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
		},
		'unsubscribe':{
		  method: 'POST',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/unsubscribe/players/:playerId',
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
  
  .factory('Team',['$resource', 'envConfiguration', 'TokenHandler','Global', function posts($resource, envConfiguration, TokenHandler, Global) {
    var config = envConfiguration[envConfiguration.default];
    
    var teamServiceUrl = config.host +  ":port/" + config.api_base_version + '/teams/:id';
   	
    var teamResource = $resource (teamServiceUrl,
    	{
    		id:'@_id',
    		port: config.port
    	},
    	{
    		update: { method: 'PUT' },
		'get': {method:'GET', isArray: false, cache:false},
		'comment': {
		  method:'POST',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/teams/:teamId/comment',
		  params:{
		    id : Global.getUserId()		    
		  },
		  isArray:false
		},
		'subscribe':{
		  method: 'POST',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/subscribe/teams/:teamId',
		  params:{
		    id : Global.getUserId()		  
		  },
		  isArray:false
		},
		'unsubscribe':{
		  method: 'POST',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/unsubscribe/teams/:teamId',
		  params:{
		    id : Global.getUserId()		  
		  },
		  isArray:false
		},
		'playersTeam': {
		  method:'GET',
		  url: config.host +  ":port/" + config.api_base_version + '/teams/:teamId/players',
		  params:{
		    
		  },
		  isArray: true	    
		}
    	}
    );
    
    teamResource = TokenHandler.wrapActions(teamResource,["get","query","update","save"]);
    
    return teamResource;
   
  }])
  
  .factory('Activity',['$resource', 'envConfiguration', 'TokenHandler','Global', function activities($resource, envConfiguration, TokenHandler, Global) {
    var config = envConfiguration[envConfiguration.default];
    
    var feedServiceUrl = config.host +  ":port/" + config.api_base_version + '/users/:id/feeds/:feedId';
   	
    var feedResource = $resource (feedServiceUrl,
    	{
    		id:'@_id',
    		port: config.port
    	},
    	{
    		update: { method: 'PUT' },
		'get': {
		  method:'GET',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/feeds/:feedId',
		  params:{
		    id : Global.getUserId(),		    	  
		  },
		  isArray: false
		},
		'save': {
		  method:'POST',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/feeds',
		  params:{
		    id : Global.getUserId(),		    	  
		  },
		  isArray:false
		},
		'comment': {
		  method:'POST',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/players/:playerId/comment',
		  params:{
		    id : Global.getUserId(),		    	  
		  },
		  isArray:false
		},
		'commentFeed': {
		  method:'POST',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/feeds/:feedId/comment',
		  params:{
		    id : Global.getUserId(),		    	  
		  },
		  isArray:false
		},
		'commentsFriends':{
		  method:'GET',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/friends/comments',
		  params:{
		    id : Global.getUserId(),		    	  
		  },
		  isArray:true
		},
		'getCommentsFeed':{
		  method:'GET',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/feeds/:feedId/comments?skip=:skip&limit=:limit',
		  params:{
		    id : Global.getUserId(),		    	  
		  },
		  isArray:true
		},
		'feedsPlayer':{
		  method:'GET',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/players/:playerId/feeds',
		  params:{
		    id : Global.getUserId(),		    	  
		  },
		  isArray:true
		},
		'feedsTeam':{
		  method:'GET',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/teams/:teamId/feeds?skip=:skip&limit=:limit',
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
		'communityFeeds':{
		  method:'GET',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/community/feeds?skip=:skip&limit=:limit',
		  params:{
		    id : Global.getUserId(),
		    skip:0,
		    limit:30
		  },
		  isArray:true
		},
		'feedsSubcribed':{
		  method:'GET',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/feeds?skip=:skip&limit=:limit',
		  params:{
		    id : Global.getUserId(),
		    skip:0,
		    limit:30
		  },
		  isArray:true
		},
		'scoreFeeds':{
		  method:'GET',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/scores?skip=:skip&limit=:limit',
		  params:{
		    id : Global.getUserId(),
		    skip:0,
		    limit:30
		  },
		  isArray:true
		}
    	}
    );
    
    feedResource = TokenHandler.wrapActions(feedResource,["get","query","update","save","comment","getCommentsFeed"]);
    
    return feedResource;
   
  }])
  
  .factory('Search',['$resource', 'envConfiguration', 'TokenHandler', 'Global', function posts($resource, envConfiguration, TokenHandler, Global) {
    var config = envConfiguration[envConfiguration.default];
    
    var searchServiceUrl = config.host +  ":port/" + config.api_base_version + '/search/:name';
   	
    var searchResource = $resource(searchServiceUrl,
    	{
    		name:'@name',
    		port: config.port
    	},
	{
	  'topItems':{
		  method:'GET',
		  url: config.host +  ":port/" + config.api_base_version + '/users/:id/top/items?skip=:skip&limit=:limit&skipTeam=:skip&limitTeam=:limit',
		  params:{
		    id : Global.getUserId(),
		    skip:0,
		    limit:30,
		    skipTeam:0,
		    limitTeam:5
		  },
		  isArray:true,
		  ignoreLoadingBar: true
		}
	}
    );
    
    searchResource = TokenHandler.wrapActions(searchResource,["query"]);
    
    return searchResource;
   
  }]);
