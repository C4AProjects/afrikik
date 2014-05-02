'use strict';

angular.module('nouchiapiApp')
  .factory('PostRequest',['$resource', 'config', function posts($resource, config) {
    var postServiceUrl = config.host +  ":port/" + config.api_base_version + '/postrequests/:id';
   	
    var postResource = $resource (postServiceUrl,
    	{
    		id:'@_id',
    		port:config.port
    	},
    	{
    		update: { method: 'PUT' }
    	}
    );
    return postResource;
   
  }]);
