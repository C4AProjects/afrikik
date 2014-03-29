'use strict';

angular.module('nouchiapiApp')
  	.service('authenticationService',['$http','config','TokenHandler','Global','storage','$state','$stateParams', function Authenticator($http, config, TokenHandler, Global, localStorage, $state, $stateParams) {
	  	var loginUrl = config.host  + config.port +'/oauth/token';
	  	var logoutUrl = config.host  + config.port +'/logout';
	  	var resetPasswordUrl = config.host +config.port  +"/" + config.api_base_version + '/users/reset';
	  	
	  var isAuthenticated=false;
	  console.log("Auth Service URL: " + loginUrl)
	
	  var authServiceApi ={
		  	login:function(user){

		  		var payload = {
		          	username: user.email,
		          	password: user.password,
		          	grant_type: 'password',
		          	client_id: config.clientKey,
		          	client_secret: config.clientSecret,
		          	redirect_uri:config.host,
		          	site:config.host 
		        };

			  	return $http.post(loginUrl, payload).then(function(response){
				  	if(response.data.access_token )
				  	{
					  	TokenHandler.set(response.data.access_token.token )
					  	response.data.success=true;
					  	Global.setUser(response.data.access_token.user);
					  	$http.defaults.headers.common['Authorization'] = "Basic " + response.data.access_token.token;
				  	}
				  	
				  	return response.data
			  	},
			  	function(loginFailedResponse){
			  		loginFailedResponse.data.success=false;
			  		return loginFailedResponse.data;
			  	}); 
		  	},
		  	confirmRegistration:function(confirmationCode){
		  		registrationConfirmationUrl = registrationConfirmationUrl + confirmationCode

			  	return $http.get(registrationConfirmationUrl)
			  	
		  	},
		  	logout:function(){
		  		Global.reset();
		  		TokenHandler.invalidate();
			  	return  $http.get(logoutUrl); 
		  	},
		  	reset:function(userEmail){
			  	return  $http.post(resetPasswordUrl, {email:userEmail})
		  	}
		  	
	  }
	  return authServiceApi
  }]);

