'use strict';
angular.module('Afrikik.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('MemberService', function() {

  var currentMember = {};
 // Might use a resource here that returns a JSON array
  // Some fake testing data
  
  var friends=[
	{ _id: 2, name: 'Amadou Daffe', picture:'amadou.png', "createdAt": "2012-04-05T17:14:17.790Z", description: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
	{ _id: 7, name: 'Abou Kone', picture:'ali.png', description: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
	{ _id: 3, name: 'Khadim Seck', description: 'Everyone likes turtles.' }
	],
      
      players=[
	{ _id: 0, name: 'Didier Drogba', picture:'drogba.png', position:'11/Forward', nationality:'The Ivory Coast', club:'Galatasaray S.K', description: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
	{ _id: 1, name: 'Eto Samuel' , picture:'eto.png', position:'9/Forward', nationality:'Cameroon', club:'Chelsea', description: 'Lovable. Loyal almost to a fault. Smarter than they let on.' }    
      ];
      
  var members = [
    { _id: 0, name: 'Ousmane Samba', following: friends, followers:friends, subscribedPlayers:players, picture:'drogba.png', "createdAt": "2012-04-05T17:14:17.790Z", description: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
    { _id: 1, name: 'Fatoumata', following: friends, followers:friends, subscribedPlayers:players, picture:'eto.png', description: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
    { _id: 2, name: 'Amadou Daffe', following: friends, followers:friends, subscribedPlayers:players, description: 'Everyone likes turtles.' },
    { _id: 3, name: 'Khadim Seck', following: friends, subscribedPlayers:players, description: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' },
    { _id: 4, name: 'Mansour Fall', following: friends, subscribedPlayers:players, description: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
    { _id: 5, name: 'HayThem', following: friends, subscribedPlayers:players, description: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
    { _id: 6, name: 'Kossi Jojo', following: friends, subscribedPlayers:players, description: 'Everyone likes turtles.' },
    { _id: 7, name: 'Abou Kone', following: friends, subscribedPlayers:players, description: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' }

  ];

  return {
    all: function() {
      return members;
    },
    get: function(memberId) {
      // Simple index lookup
      return members[memberId];
    },
    getById: function(memberId){      
      return _.find(members, function(member){
        return member._id == memberId
      })
    },
    setCurrentMember: function(member){
      currentMember = member;
    },
    getCurrentMember: function(){
      return currentMember;
    }
  };
})

.factory('PlayerService', function() {
  var currentPlayer= {};
  
// Might use a resource here that returns a JSON array
  // Some fake testing data
  var career ="Didier Drogba, né le 11 mars 1978 à Abidjan, est un footballeur international ivoirien. Depuis janvier 2013 , il évolue au poste d'attaquant dans le club turc de Galatasaray."+

                                "Drogba débute sa carrière en France, au Mans Union Club 72. Il découvre la Ligue 1 avec l'En Avant de Guingamp, puis dispute ses premières rencontres européennes sous les couleurs de l'Olympique de Marseille. L'attaquant est transféré au Chelsea FC en 2004 et remporte notamment l'édition 2011-2012 de la Ligue des champions avec le club britannique. Après son départ, il est élu « meilleur joueur de l'histoire du club » par les supporters."+
                                
                                "Didier Drogba fait partie de l'équipe de Côte d'Ivoire depuis 2002. Il est nommé capitaine de la sélection, dont il est le meilleur buteur."+
                                
                                "Il possède également la nationalité française.";
  var players = [
    { _id: 0, name: 'Didier Drogba', picture:'drogba.png', position:'11/Forward', nationality:'The Ivory Coast', club:'Galatasaray S.K', career: career },
    { _id: 1, name: 'Eto Samuel' , picture:'eto.png', position:'09/Forward', nationality:'Cameroon', club:'Chelsea', career: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
    { _id: 2, name: 'Papis Cisse', career: 'Everyone likes turtles.' },
    { _id: 3, name: 'Webo', position:'29/Forward', nationality:'Cameroon', club:'Espanyol', career: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' },
    { _id: 4, name: 'El Hadj Diouf', position:'11/Forward', nationality:'Senegal', club:'Liverpool', career: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
    { _id: 5, name: 'Yaya Toure', position:'08/Middle', nationality:'The Ivory Coast', club:'Manchester City', career: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
    { _id: 5, name: 'Adebayor', position:'9/Forward', nationality:'Rep. Democratique de Congo', club:'Arsenal', career: 'Everyone likes turtles.' },
    { _id: 7, name: 'Sadio Mane', position:'10/Forward', nationality:'Senegal', club:'Metz',career: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' }

  ];

  return {
    
    all: function() {
      return players;
    },
    get: function(playerId) {
      // Simple index lookup
      return players[playerId];
    },
    getById: function(playerId){      
      return _.find(players, function(player){
        return player._id == playerId
      })
    },
    setCurrentPlayer: function(player){
      currentPlayer = player;
    },
    getCurrentPlayer: function(){
      return currentPlayer;
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

.factory('ActivityService', function() {
  
  var activities = [
        { _id: 0, _player: 0, createdAt: '2014-07-05T17:14:17.790Z', comments:[2,4,1], _user:{name:'Amadou Daffe'}, message: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
        { _id: 1, _player: 0, createdAt: '2014-06-05T15:14:17.790Z', comments:[2,4,1,8,5], _user:{name:'Ousman Samba'}, message: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
        { _id: 2, _player: 0, createdAt: '2014-05-05T17:14:17.790Z', comments:[2,4], message: 'Everyone likes turtles.' },
        { _id: 3, _player: 0, createdAt: '2014-05-05T14:14:17.790Z', comments:[2,4,1,25,27,8,11], _user:{name:'Mansour Fall'}, message: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' }    ,
        { _id: 4, _player: 1, createdAt: '2014-04-05T17:14:17.790Z', _user:{name:'Abou Kone'}, message: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
        { _id: 5, _player: 1, createdAt: '2013-04-05T10:14:17.790Z', _user:{name:'Fatoumata'}, message: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
        { _id: 6, _player: 1, createdAt: '2012-04-05T13:14:17.790Z', comments:[2,4,1,4,44,2], _user:{name:'Haythem'}, message: 'Everyone likes turtles.' }
      ];

  return {
    
    all: function() {
      return activities;
    },
    get: function(feedId) {
      // Simple index lookup
      return activities[feedId];
    },
    getById: function(activityId){      
      return _.find(activities, function(activity){
        return activity._id == activityId
      })
    },
    activitiesPlayer: function(playerId){
      if (playerId==null) {
        return [];
      }
      return _.filter(activities, function(activity){
        return activity._player == playerId
      })
    },
    addActivity: function(activity){
      activities.splice(0, 0, activity)     
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