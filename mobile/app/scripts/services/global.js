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
			if (this.user) {
			    this.user.menuLeft = true;
			    this.user.subscriptions = this.user.subscribedPlayers||[]
			    this.user.subscriptions = this.user.subscriptions.concat(this.user.subscribedTeams)
			    this.user.friends = this.user.following||[]
			    this.user.friends = this.user.friends.concat(this.user.followers)
			}
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
		setTopItems:function(items){
	    		localStorage.set('topItemsPlayersAndTeams', items);
	    	},
	    	getTopItems:function(){
			 return  localStorage.get('topItemsPlayersAndTeams');			
	    	},
		setFeedsToCache:function(items){
	    		localStorage.set('subscribedFeedsInCache', items);
			localStorage.set('subscribedFeedsInCacheDate', Date.now());
	    	},
	    	getFeedsFromCache:function(){
			 return  localStorage.get('subscribedFeedsInCache');			
	    	},
		getFeedsFromCacheDate:function(){
			 return  localStorage.get('subscribedFeedsInCacheDate');			
	    	},
		cleanAll : function(){
		    localStorage.set('subscribedFeedsInCache', []);
		}

	    };
	    return global;

}]);
