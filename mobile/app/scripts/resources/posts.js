'use strict';

angular.module('Afrikik')
  .factory('Post',['$resource', 'envConfiguration','Global','TokenHandler', function posts($resource, config, Global, TokenHandler) {
    var postServiceUrl = config.host +  ":port/" + config.api_base_version + '/posts/:id';
   	
    var postResource = $resource (postServiceUrl,
    	{
    		id:'@_id',
    		port:config.port
    	},
    	{
    		update: { method: 'PUT' },
       
    	}
      
    );

    postResource = TokenHandler.wrapActions(postResource,["get","query","update","save","like"]);
    return postResource;
   
  }]);
