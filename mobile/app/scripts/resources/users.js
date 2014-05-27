'use strict';

angular.module('Afrikik')
  	.factory('User',['$resource','envConfiguration','TokenHandler','Global', function userService($resource, config, tokenHandler, Global) {
	var env = config['default'],
		userServiceUrl = config[env].host +  ":port/" + config[env].api_base_version + '/users/:id',
		userResource = $resource(userServiceUrl,
		{
         		id: "@_id",
         		port:config[env].port

     		},
		{
		  me:{
		    method:'GET',
		    params:{
		      id:Global.getUserId()
		    },
		    url: config[env].host +  ":port/" + config[env].api_base_version + '/users/:id/me/'
		  },
		  get:{
		    method:'GET',
		    params:{
		      id:'@_id'
		    },
		    isArray:false
		  },
		  like:{
		    method:'POST',
		    params:{
		     id:Global.getUserId()
		    },
		    url: config[env].host +  ":port/" + config[env].api_base_version + '/users/:id/likes/:postId',
		    isArray:false
		  }
	
		}
    	);

	userResource = tokenHandler.wrapActions(userResource,["get","query","update","save","me"]);
	return userResource;

  	}]);

