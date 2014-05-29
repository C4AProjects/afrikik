'use strict';

angular.module('Afrikik')
  	.service('authenticationService',['$http','envConfiguration','TokenHandler','Global','storage','$state','$stateParams', function Authenticator($http, config, TokenHandler, Global, localStorage, $state, $stateParams) {
	  	var env = config['default'];
		var loginUrl = config[env].host  + config[env].port +'/api/v1/users/session';
	  	var logoutUrl = config[env].host  + config[env].port +'/logout';
	  	var resetPasswordUrl = config[env].host + config[env].port  +"/" + config[env].api_base_version + '/users/reset';
	  	
	  var isAuthenticated=false;
	  console.log("Auth Service URL: " + loginUrl)
	
	  var authServiceApi ={
		  	login:function(user){

		  		var payload = {
		          	username: user.email,
				email: user.email,
		          	password: user.password,
		          	grant_type: 'password',
		          	client_id: config[env].clientKey,
		          	client_secret: config[env].clientSecret,
		          	redirect_uri:config[env].host,
		          	site:config[env].host 
		        };

			  	return $http.post(loginUrl, payload).then(function(response){
					console.log(response)
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

