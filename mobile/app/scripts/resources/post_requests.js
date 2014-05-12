'use strict';

angular.module('Afrikik')
  .factory('PostRequest',['$resource', 'envConfiguration', function posts($resource, config) {
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
