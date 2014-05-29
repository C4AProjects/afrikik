'use strict';

Afrikik
        .controller('ActivityCtrl', function($scope, $stateParams, $ionicSlideBoxDelegate, ActivityService, Global) {
                
                $scope.activities = ActivityService.feedsSubscribed(Global.getUserId());
                
                $scope.user = Global.getUser()
                
                $scope.go = function(index){               
                      $ionicSlideBoxDelegate.slide(index)
                }               
                
                $scope.communities  = ActivityService.commentsFriends(Global.getUserId())
                
                $scope.subscriptions = []
                
                $scope.notifications = ActivityService.notifications($scope.user.subscribedPlayers)
        
        })