'use strict';

angular.module('Afrikik')
  	.factory('Global', ['storage','envConfiguration', function(localStorage, config){
	    var global,
	    env = config['default'];

	    global = { 
	    	user: window.user, 
	    	setUser:function(user){
	    		window.user = user
	    		localStorage.set(config[env].localStorageUserKey, user);
	    	},
	    	getUser:function(){
			this.user = localStorage.get(config[env].localStorageUserKey)
			window.user = this.user
	    		return this.user;
	    	},
	    	getUserId:function(){
	    		return (this.getUser())?this.getUser()._id:undefined;
	    	},
	    	reset:function(){
	    		 localStorage.set(config[env].localStorageUserKey, "")
	    		 window.user = undefined;
	    	},
	    	authenticated: function(){
	    		return !!window.user;
	       	},


	    };
	    return global;

}]);
