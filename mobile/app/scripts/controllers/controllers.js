'use strict';
angular.module('Afrikik.controllers', [])


// A simple controller that fetches a list of data from a service
.controller('PetIndexCtrl', function($scope, PetService) {
  // "Pets" is a service returning mock data (services.js)
  $scope.pets = PetService.all();
  

})


// A simple controller that shows a tapped item's data
.controller('PetDetailCtrl', function($scope, $stateParams, PetService) {
  // "Pets" is a service returning mock data (services.js)
  $scope.pet = PetService.get($stateParams.petId);
})

.controller('MainCtrl2', function($scope, $ionicSideMenuDelegate) {
    //SettingsService.set('maxResults',"50");

    // Menu button
    $scope.leftButtons = [{
        type: 'button-icon button-clear ion-navicon',
        tap: function(e) {
            $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
        }
    }];

    ionic.Platform.ready(function(){
        console.log("Cordova is ready");
        // Add device specific stuff here
    });
})

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate,SettingsService) {
    SettingsService.set('maxResults',"50");

    // Menu button
    $scope.leftButtons = [{
        type: 'button-icon button-clear ion-navicon',
        tap: function(e) {
            $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
        }
    }];

    ionic.Platform.ready(function(){
        console.log("Cordova is ready");
        // Add device specific stuff here
    });
})



