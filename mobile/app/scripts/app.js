// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)

'use strict';
var apiServer;


angular.module('Afrikik', ['ionic', 'Afrikik.services', 'Afrikik.controllers', 'config', 'angularLocalStorage','ui.router','ngResource','infinite-scroll','pascalprecht.translate','underscore'])


.config(function($stateProvider, $urlRouterProvider, envConfiguration) {
  
  
  var env = 'dev',
  
  apiServer = envConfiguration[env].host + envConfiguration[env].port + '/' + envConfiguration[env].api_base_version;

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  
  $stateProvider
  
    .state('index', {
      url: '/index',
      templateUrl: 'templates/main.html',
      controller: 'MainCtrl'
    })
    
    .state('private', {
      url: '/private',
      abstract: true,
      templateUrl: 'templates/private.html',
      controller: 'MainCtrl'
    })  
    
    .state('private.tab', {
      parent:'private',
      url: '/tab',
      templateUrl: 'templates/tabs.html'
    })

    .state('private.tab.member', {
      url: '/member',
      views: {
        'member-tab': {
          templateUrl: 'templates/members/member.html',
          controller: 'PetIndexCtrl'
        }
      }
    })
   
    .state('private.tab.pet-detail', {
      url: '/pet/:petId',
      views: {
        'pets-tab': {
          templateUrl: 'templates/pet-detail.html',
          controller: 'PetDetailCtrl'
        }
      }
    })

    .state('private.tab.adopt', {
      url: '/adopt',
      views: {
        'adopt-tab': {
          templateUrl: 'templates/adopt.html'
        }
      }
    })

    .state('private.tab.about', {
      url: '/about',
      views: {
        'about-tab': {
          templateUrl: 'templates/about.html'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/index');

});

