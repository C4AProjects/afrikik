// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)

'use strict';
var apiServer;


var Afrikik = angular.module('Afrikik', ['ionic',/*'openfb',*/ 'Afrikik.services', 'Afrikik.controllers', 'config', 'angularLocalStorage','ui.router','ngResource','infinite-scroll','pascalprecht.translate','underscore', 'angular-loading-bar','ngAnimate'])

/*.run(function ($http, $rootScope, $state, $ionicPlatform, $window, OpenFB) {
     
        OpenFB.init('1422514281357788');

        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        /*$rootScope.$on('$stateChangeStart', function(event, toState) {
            if (toState.name !== "index" && toState.name !== "logout" && !$window.sessionStorage['fbtoken']) {
                $state.go('index');
                event.preventDefault();
            }
        });

        $rootScope.$on('OAuthException', function() {
            $state.go('index');
        });

    })*/


.config(function($httpProvider, $stateProvider, $urlRouterProvider, envConfiguration) {
  
  
  //$httpProvider.defaults.useXDomain = true;
   // delete $httpProvider.defaults.headers.common['X-Requested-With'];
  
  
  //var env = 'dev',
  
  //apiServer = envConfiguration[env].host + envConfiguration[env].port + '/' + envConfiguration[env].api_base_version;

  $stateProvider
 
     .state('index', {
      url: '/index',
      templateUrl: 'templates/main.html',
      controller: 'MainCtrl'
    })
     
     .state('logout', {
      url: '/index',
      templateUrl: 'templates/main.html',
      controller: 'MainCtrl'
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
          templateUrl: 'templates/search.html'
        }
      }
    })
    
    .state('private.profile', {
      url: '/profile',
      views: {
        'profile' :{
          templateUrl: 'templates/members/profile.html'
        }
      }
    })
   
    .state('private.member', {
      url: '/member/:_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/members/member.html',
          controller: 'MemberCtrl'
        }
      }
    })
    
    .state('private.player', {
      url: '/player/:_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/players/player.html',
          controller: 'PlayerCtrl'
        }
      }
    })
    
    .state('private.team', {
      url: '/team/:_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/teams/team.html',
          controller: 'TeamCtrl'
        }
      }
    })
    
    .state('private.feeds', {
      url: '/feeds',
      views: {
        'menuFeed': {
          templateUrl: 'templates/activities/activities.html',
          controller: 'ActivityCtrl'
        }
      }
    })
    
    .state('private.notifications', {
      url: '/notifications',
      views: {
        'notification': {
          templateUrl: 'templates/activities/notifications.html',
          controller: 'ActivityCtrl'
        }
      }
    })
    
    .state('private.community', {
      url: '/community',
      views: {
        'community': {
          templateUrl: 'templates/activities/community.html',
          controller: 'ActivityCtrl'
        }
      }
    })
  
    .state('about', {
      url: '/about',      
      templateUrl: 'templates/about.html',
      controller: function AboutCtrl(){
        $scope.date = new Date().getFullYear();
      }
      
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/index');

});

