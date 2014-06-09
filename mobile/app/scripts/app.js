// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)

'use strict';
var apiServer;


var Afrikik = angular.module('Afrikik', [ 'jmdobry.angular-cache','ionic',/*'openfb',*/ 'Afrikik.services', 'Afrikik.controllers', 'config', 'angularLocalStorage','ui.router','ngResource','infinite-scroll','pascalprecht.translate','underscore', 'angular-loading-bar','ngAnimate'])

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


.config(function($httpProvider, $stateProvider, $urlRouterProvider, envConfiguration, $angularCacheFactoryProvider, cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
  cfpLoadingBarProvider.includeBar = false;
  
  /*$angularCacheFactoryProvider.setCacheDefaults({

        // This cache can hold 1000 items
        capacity: 1000,

        // Items added to this cache expire after 15 minutes
        maxAge: 900000,

        // Items will be actively deleted when they expire
        deleteOnExpire: 'aggressive',

        // This cache will check for expired items every minute
        recycleFreq: 60000,

        // This cache will clear itself every hour
        cacheFlushInterval: 3600000,

        // This cache will sync itself with localStorage
        storageMode: 'localStorage',

        // Custom implementation of localStorage
        //storageImpl: myLocalStoragePolyfill,

        // Full synchronization with localStorage on every operation
        verifyIntegrity: true,

        // This callback is executed when the item specified by "key" expires.
        // At this point you could retrieve a fresh value for "key"
        // from the server and re-insert it into the cache.
        onExpire: function (key, value) {

        }
    
  })*/
  
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
      controller: 'RefreshCtrl'
    })
    
    
    .state('private.search', {
      url: '/search',
      views: {
        'search' :{
          templateUrl: 'templates/search.html'
        }
      }
    })
    
    .state('private.search-page', {
      url: '/search-page',
      views: {
        'search' :{
          templateUrl: 'templates/players/search-page.html'
        }
      }
    })
    
    .state('private.profile', {
      url: '/profile',
      views: {
        'profile' :{
          templateUrl: 'templates/members/profile.html',
          controller: 'MemberCtrl'
        }
      }
    })
    
    .state('private.subscriptions', {
      url: '/subscriptions',
      views: {
        'subscriptions' :{
          templateUrl: 'templates/members/subscriptions.html',
          controller: 'PlayerCtrl'
        }
      }
    })
   
    .state('private.member', {
      url: '/member/:_id',
      views: {
        'search': {
          templateUrl: 'templates/members/member.html',
          controller: 'MemberCtrl'
        }
      }
    })
    
    .state('private.player', {
      url: '/player/:_id',
      views: {
        'search': {
          templateUrl: 'templates/players/player.html',
          controller: 'PlayerCtrl'
        }
      }
    })
    
    .state('private.team', {
      url: '/team/:_id',
      views: {
        'search': {
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
    
    .state('private.feed', {
      url: '/feed/:_id',
      views: {
        'menuFeed': {
          templateUrl: 'templates/activities/activity.html',
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

