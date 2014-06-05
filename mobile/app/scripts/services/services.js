'use strict';
angular.module('Afrikik.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('MemberService', ['Member',function(Member) {

  var currentMember = {};

  return {
    all: function() {
      return [];
    },
    getById: function(memberId){      
      var member = Member.get({id:memberId})
      return member;
    }
  };
}])
/*************************************************************************************************************
 *                                        PLAYER SERVICE
 *
 ************************************************************************************************************/
.factory('PlayerService', ['Player', 'Search', 'Global', function(Player,Search, Global) {
  var currentPlayer= {};

  var cachedItems = [];

  return {    
    cachedItems: function() {
      return cachedItems;
    },
    topItems: function(cb){
      if (cb) {
        Search.topItems({}, cb)
      }else {
        Search.topItems({}, function(values, responseHeaders) {
          console.log(values)
          
          return values;
        })
      }
    },
    itemsByName: function(name){      
      return cachedItems = Search.query({name: name})
    },
    getById: function(playerId){
      //console.log('and looking for from the API....')
      var player = Player.get({id:playerId})
      return player;
    },
    getByIdFromCache: function(itemId){      
      console.log('looking for from the cache....')
      return _.find(Global.getTopItems(), function(item){
        return item._id == itemId
      })
    },
    comment: function(comment){
      Player.comment({playerId: comment._player._id}, {message:comment.message})
    },
    subscribe: function(playerId){
      console.log('Player Id :' + playerId)
      Player.subscribe({playerId: playerId},{})
    }
  };
}])

/**
 .factory('TeamService', function ($resource) {
    return $resource(serverApi + '/teams/:teamId/:userId', {}, {
        subscribe: { method: 'POST', isArray: false, format: 'json', cache: false, params: { teamId: '@teamId', tokenId: '@tokenId', userId: '@userId'} },
        unsubscribe: { method: 'DELETE', isArray: false, format: 'json', cache: false, params: { teamId: '@teamId', tokenId: '@tokenId', userId: '@userId'} }
    })
})
 */
.factory('TeamService', ['Team', 'Search',  function(Team, Search) { 

  var cachedItems = [];

  return {    
    cachedItems: function() {
      return cachedItems;
    },
    topItems: function(){      
      return cachedItems = Search.topItems({})
    },
    itemsByName: function(name){      
      return cachedItems = Search.query({name: name})
    },
    getById: function(teamId){
      var team = Team.get({id:teamId})
      return team;
    },
    getByIdFromCache: function(itemId){      
       return _.find(cachedItems, function(item){
        return item._id == itemId
      })
    },
    comment: function(comment){
      Team.comment({teamId: comment._team._id}, {message:comment.message})
    },
    subscribe: function(teamId){
      Team.subscribe({teamId: teamId},{})
    },
    playersTeam: function(teamId){
      Team.playersTeam({teamId: teamId})
    }
  };
}])

.factory('ActivityService', ['Activity', function(Activity) {

  var feeds = [];

  return {
    
    feedsSubscribed: function(userId){
      return Activity.query({id:userId});
    },
    feedsPlayer: function(playerId) {
      return feeds = Activity.feedsPlayer({playerId:playerId});
    },
    feedsTeam: function(teamId) {
      return feeds = Activity.feedsTeam({teamId:teamId});
    },
    getByFeedById: function(feedId){      
      return Activity.get({feedId:feedId})
    },
    getByFeedFromCahe: function(feedId){      
      return _.find(feeds, function(feed){
        return feed._id == feedId
      })
    },
    notifications: function(subscribedList){
      var list = []
      for(var i=0; i< subscribedList.length;i++){
        list.push(subscribedList[i]._id)
      }
      return _.filter([], function(activity){
        return (list.indexOf(activity._player)>0 && activity.createdAt)
      })
    },
    commentsFriends: function(userId){
      return Activity.commentsFriends({id:userId})
    },
    commentFeed: function(comment){
      return Activity.commentFeed({feedId:comment._feed._id}, {message:comment.message})
    },
    create: function(feed){
      return Adtivity.save({},feed)
    },
    getScoreFeeds : function(){
      
    }
    
  };
}])

.factory('AuthService', function($http /*,$cookieStore*/){

    var currentUser = /*$cookieStore.get('user') ||*/ { username: '' };

   // $cookieStore.remove('user');

    function changeUser(user) {
        angular.extend(currentUser, user);
    }

    return {
        isLoggedIn: function(user) {
            if(user === undefined) {
                user = currentUser;
            }
            return user.username!==''?true:false;
        },
        register: function(user, success, error) {
            $http.post(serverApi + '/register', user).success(function(res) {
                changeUser(res);
                success();
            }).error(error);
        },
        login: function(user, success, error) {
            
            $http.post('http://localhost.localdomain:2014/api/v1/admin/users/session', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
        },
        logout: function(success, error) {
            $http.post('/logout').success(function(){
                changeUser({
                    username: '',
                    role: userRoles.public
                });
                success();
            }).error(error);
        },        
        user: currentUser
    };
})


.factory('MediaService', function($resource, $q){
    var music = $resource('https://itunes.apple.com/:action',
        { action: "search", callback: 'JSON_CALLBACK'},
        { 'get':  {method: 'JSONP'} });


    return {
        search: function(query,type,limit) {
            var q = $q.defer();

            music.get({
                term: query, media: type, limit: limit
            }, function(resp) {
                q.resolve(resp);
            }, function(err) {
                q.reject(err);
            })

            return q.promise;
        }
    }
})

// Shared data from settings needed by different controllers
.service('SettingsService', function() {
    var _variables = {};

    return {
        get: function(varname) {
            return (typeof _variables[varname] !== 'undefined') ? _variables[varname] : false;
        },
        set: function(varname, value) {
            _variables[varname] = value;
        }
    };
});