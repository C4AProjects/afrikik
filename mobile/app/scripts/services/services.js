'use strict';
angular.module('Afrikik.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('MemberService', ['Member',function(Member) {

  var currentMember = {};
 // Might use a resource here that returns a JSON array
  // Some fake testing data
  
  /*var friends=[
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

  ];*/

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
.factory('PlayerService', ['Player', 'Search', function(Player,Search) {
  var currentPlayer= {};
  
// Might use a resource here that returns a JSON array
  // Some fake testing data
  /*var career ="Didier Drogba, né le 11 mars 1978 à Abidjan, est un footballeur international ivoirien. Depuis janvier 2013 , il évolue au poste d'attaquant dans le club turc de Galatasaray."+

                                "Drogba débute sa carrière en France, au Mans Union Club 72. Il découvre la Ligue 1 avec l'En Avant de Guingamp, puis dispute ses premières rencontres européennes sous les couleurs de l'Olympique de Marseille. L'attaquant est transféré au Chelsea FC en 2004 et remporte notamment l'édition 2011-2012 de la Ligue des champions avec le club britannique. Après son départ, il est élu « meilleur joueur de l'histoire du club » par les supporters."+
                                
                                "Didier Drogba fait partie de l'équipe de Côte d'Ivoire depuis 2002. Il est nommé capitaine de la sélection, dont il est le meilleur buteur."+
                                
                                "Il possède également la nationalité française.";
  var players = [
    { _id: 0, name: 'Didier Drogba', picture:'drogba.png', position:'11/Forward', nationality:'The Ivory Coast', club:'Galatasaray S.K', career: 'Best player african eve have' },
    { _id: 1, name: 'Eto Samuel' , picture:'eto.png', position:'09/Forward', nationality:'Cameroon', club:'Chelsea', career: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
    { _id: 2, name: 'Papis Cisse', position:'09/Forward', nationality:'Cameroon', club:'Chelsea', career: 'Everyone likes turtles.' },
    { _id: 3, name: 'Webo', position:'29/Forward', nationality:'Cameroon', club:'Espanyol', career: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' },
    { _id: 4, name: 'El Hadj Diouf', position:'11/Forward', nationality:'Senegal', club:'Liverpool', career: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
    { _id: 5, name: 'Yaya Toure', position:'08/Middle', nationality:'The Ivory Coast', club:'Manchester City', career: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
    { _id: 5, name: 'Adebayor', position:'9/Forward', nationality:'Rep. Democratique de Congo', club:'Arsenal', career: 'Everyone likes turtles.' },
    { _id: 7, name: 'Sadio Mane', position:'10/Forward', nationality:'Senegal', club:'Metz',career: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' }

  ];
  
  var teams = [
    { _id: 0, name: 'TP Mazzembe', country: 'Republique Democratique Congo' },
    { _id: 1, name: 'Jaaraf', country: 'Senegal'},
    { _id: 2, name: 'Niarry Tally', country: 'Senegal' },
    { _id: 3, name: 'Casa FC', country: 'Senegal' },
    { _id: 4, name: 'Ghazl El Mahallah', country: 'Egypt' },
    { _id: 5, name: 'FC Inter Lion Ngoma', country: 'Cameroum' },
    { _id: 6, name: 'Africa Sport', country: 'Ivory Coast' },
    { _id: 7, name: 'Racing Club de Tunis', country: 'Tunisie' }

  ];*/
  
  var cachedItems = [];

  return {    
    cachedItems: function() {
      return cachedItems;
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
      //console.log('looking for from the cache....')
      return _.find(cachedItems, function(item){
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
.factory('TeamService', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var teams = [
    { _id: 0, name: 'TP Mazzembe', country: 'Republique Democratique Congo' },
    { _id: 1, name: 'Jaaraf', country: 'Senegal'},
    { _id: 2, name: 'Niarry Tally', country: 'Senegal' },
    { _id: 3, name: 'Casa FC', country: 'Senegal' },
    { _id: 4, name: 'Ghazl El Mahallah', country: 'Egypt' },
    { _id: 5, name: 'FC Inter Lion Ngoma', country: 'Cameroum' },
    { _id: 6, name: 'Africa Sport', country: 'Ivory Coast' },
    { _id: 7, name: 'Racing Club de Tunis', country: 'Tunisie' }

  ];
  
  var players = [
    { _id: 0, name: 'Didier Drogba', _team: 0, picture:'drogba.png', position:'11/Forward', nationality:'The Ivory Coast', club:'Galatasaray S.K', career: 'The best player in africa, champion league on 2012 with Chelsea' },
    { _id: 1, name: 'Eto Samuel', _team: 0, picture:'eto.png', position:'09/Forward', nationality:'Cameroon', club:'Chelsea', career: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
    { _id: 2, name: 'Papis Cisse', career: 'Everyone likes turtles.' },
    { _id: 3, name: 'Webo', position:'29/Forward', nationality:'Cameroon', club:'Espanyol', career: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' },
    { _id: 4, name: 'El Hadj Diouf', position:'11/Forward', nationality:'Senegal', club:'Liverpool', career: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
    { _id: 5, name: 'Yaya Toure', position:'08/Middle', nationality:'The Ivory Coast', club:'Manchester City', career: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
    { _id: 5, name: 'Adebayor', position:'9/Forward', nationality:'Rep. Democratique de Congo', club:'Arsenal', career: 'Everyone likes turtles.' },
    { _id: 7, name: 'Sadio Mane', position:'10/Forward', nationality:'Senegal', club:'Metz',career: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' }

  ];

  return {
    all: function() {
      return teams;
    },
    getById: function(teamId){      
      return _.find(teams, function(team){
        return team._id == teamId
      })
    },
    playersTeam: function(teamId){      
      return _.filter(players, function(player){
        return player._team == teamId
      })
    }
  };
})

.factory('ActivityService', ['Activity', function(Activity) {

  var feeds = [];

  return {
    
    feedsSubscribed: function(userId){
      return Activity.query({id:userId});
    },
    feedsPlayer: function(playerId) {
      return feeds = Activity.feedsPlayer({playerId:playerId});
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