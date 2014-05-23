'use strict';

Afrikik
        .controller('ActivityCtrl', function($scope, $stateParams, $ionicSlideBoxDelegate, ActivityService, Global) {
                $scope.activities = ActivityService.all();
                
                $scope.user = Global.getUser()
                
                $scope.go = function(index){               
                      $ionicSlideBoxDelegate.slide(index)
                }               
                
                $scope.communities  = ActivityService.messageCommunities($scope.user.subscribedPlayers)
                
                $scope.notifications = ActivityService.notifications($scope.user.subscribedPlayers)
        
        })