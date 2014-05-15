// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)

'use strict';
var apiServer;


var Afrikik = angular.module('Afrikik', ['ionic', 'Afrikik.services', 'Afrikik.controllers', 'config', 'angularLocalStorage','ui.router','ngResource','infinite-scroll','pascalprecht.translate','underscore','ngAnimate'])


.config(function($stateProvider, $urlRouterProvider, envConfiguration) {
  
  
  var env = 'dev',
  
  apiServer = envConfiguration[env].host + envConfiguration[env].port + '/' + envConfiguration[env].api_base_version;

  $stateProvider
 
     .state('index', {
      url: '/index',
      templateUrl: 'templates/main.html',
      controller: 'MainCtrl'
    })
     
     .state('scroll', {
      url: '/scroll',
      templateUrl: 'templates/infiniteScroll.html',
      controller: 'MemberCtrl'
    })
    
    .state('private', {
      url: '/private',
      abstract: true,
      templateUrl: 'templates/private.html', /*templates/tabs.html*/
      controller: 'MainCtrl'
    })
    
    
    .state('private.search', {
      url: '/search',
      views: {
        'menuContent' :{
          templateUrl: 'templates/search.html',
          controller: "MemberCtrl"
        }
      }
    })
   
    .state('private.member', {
      url: '/member',
      views: {
        'menuContent': {
          templateUrl: 'templates/members/member.html',
          controller: 'MemberCtrl'
        }
      }
    })
    
    .state('private.player', {
      url: '/player',
      views: {
        'menuContent': {
          templateUrl: 'templates/players/player.html',
          controller: 'PlayerCtrl'
        }
      }
    })
    
    .state('private.team', {
      url: '/team',
      views: {
        'menuContent': {
          templateUrl: 'templates/teams/team.html',
          controller: 'TeamCtrl'
        }
      }
    })

    .state('about', {
      url: '/about',      
      templateUrl: 'templates/about.html',
      controller: function AboutCtrl($scope){
        $scope.date = new Date().getFullYear();
      }
      
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/index');

});

