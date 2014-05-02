'use strict';

angular.module('nouchiapiApp')
  	.factory('Global', ['storage','config', function(localStorage, config){
		var global;

	    global = { 
	    	user: window.user, 
	    	setUser:function(user){
	    		window.user = user
	    		localStorage.set(config.localStorageUserKey, user);
	    	},
	    	getUser:function(){
	    		this.user = localStorage.get(config.localStorageUserKey)
	    		window.user = this.user
	    		return this.user;
	    	},
	    	getUserId:function(){
	    		return (this.getUser())?this.getUser()._id:undefined;
	    	},
	    	reset:function(){
	    		 localStorage.set(config.localStorageUserKey, "")
	    		 window.user = undefined;
	    	},
	    	authenticated: function(){
	    		return !!window.user;
	       	},


	    };
		return global;

}]);
