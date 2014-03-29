'use strict';

angular.module('nouchiapiApp')
  	.factory('User',['$resource','config','TokenHandler','Global', function userService($resource, config, tokenHandler,Global) {
   		var userServiceUrl = config.host +  ":port/" + config.api_base_version + '/users/:id';
   		var userResource = $resource(userServiceUrl,
        {
         		id: "@id",
         		port:config.port

     		},
        {
          me:{
            method:'GET',
            params:{
              id:Global.getUserId()
            },
            url: config.host +  ":port/" + config.api_base_version + '/users/:id/me/'
          },
          get:{
            method:'GET',
            params:{
              id:'@id'
            },
            isArray:false
          },
          like:{
            method:'POST',
            params:{
             id:Global.getUserId()
            },
            url: config.host +  ":port/" + config.api_base_version + '/users/:id/likes/:postId',
            isArray:false
          }

        }
    	);

   		userResource = tokenHandler.wrapActions(userResource,["get","query","update","save","me"]);
   		return userResource;

  	}]);

