'use strict';

Afrikik
        // A simple controller that fetches a list of data from a service
        .controller('TeamCtrl', function($scope, $stateParams, $ionicSlideBoxDelegate, TeamService, PlayerService) {
                // "Members" is a service returning mock data (services.js)          
                $scope.players = PlayerService.all();
                
                
                $scope.go = function(index){               
                      $ionicSlideBoxDelegate.slide(index)
                }
        
        })
