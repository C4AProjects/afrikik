'use strict';
angular.module('Afrikik.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('MemberService', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var members = [
    { id: 0, name: 'Didier Drogba', description: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
    { id: 1, name: 'Eto Samuel', description: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
    { id: 2, name: 'Papis Cisse', description: 'Everyone likes turtles.' },
    { id: 3, name: 'Senegal', description: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' },
    { id: 4, name: 'Didier Drogba', description: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
    { id: 5, name: 'Eto Samuel', description: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
    { id: 5, name: 'Papis Cisse', description: 'Everyone likes turtles.' },
    { id: 7, name: 'Senegal', description: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' }

  ];

  return {
    all: function() {
      return members;
    },
    get: function(memberId) {
      // Simple index lookup
      return members[memberId];
    }
  };
})

.factory('PlayerService', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var members = [
    { id: 0, name: 'Didier Drogba', description: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
    { id: 1, name: 'Eto Samuel', description: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
    { id: 2, name: 'Papis Cisse', description: 'Everyone likes turtles.' },
    { id: 3, name: 'Senegal', description: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' },
    { id: 4, name: 'Didier Drogba', description: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
    { id: 5, name: 'Eto Samuel', description: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
    { id: 5, name: 'Papis Cisse', description: 'Everyone likes turtles.' },
    { id: 7, name: 'Senegal', description: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' }

  ];

  return {
    all: function() {
      return members;
    },
    get: function(memberId) {
      // Simple index lookup
      return members[memberId];
    }
  };
})
/**
 .factory('TeamService', function ($resource) {
    return $resource(serverApi + '/teams/:teamId/:userId', {}, {
        subscribe: { method: 'POST', isArray: false, format: 'json', cache: false, params: { teamId: '@teamId', tokenId: '@tokenId', userId: '@userId'} },
        unsubscribe: { method: 'DELETE', isArray: false, format: 'json', cache: false, params: { teamId: '@teamId', tokenId: '@tokenId', userId: '@userId'} }
    })
})
 */
.factory('TeamService', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var teams = [
    { id: 0, name: 'TP Mazzembe', country: 'Republique Democratique Congo' },
    { id: 1, name: 'Jaaraf', country: 'Senegal'},
    { id: 2, name: 'Niarry Tally', country: 'Senegal' },
    { id: 3, name: 'Casa FC', country: 'Senegal' },
    { id: 4, name: 'Ghazl El Mahallah', country: 'Egypt' },
    { id: 5, name: 'FC Inter Lion Ngoma', country: 'Cameroum' },
    { id: 5, name: 'Africa Sport', country: 'Ivory Coast' },
    { id: 7, name: 'Racing Club de Tunis', country: 'Tunisie' }

  ];

  return {
    all: function() {
      return teams;
    },
    get: function(teamId) {
      // Simple index lookup
      return teams[teamId];
    }
  };
})

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