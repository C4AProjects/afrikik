'use strict';

Afrikik
        .controller('ActivityCtrl', function($scope, $state, $stateParams, $ionicSlideBoxDelegate, ActivityService, Global) {
                
                $scope.activities = ActivityService.feedsSubscribed(Global.getUserId());
                
                $scope.user = Global.getUser()
                
                if ($stateParams._id) {
                        $scope.feed = ActivityService.getByFeedById($stateParams._id);
                }
                                                       
                //$scope.communities  = ActivityService.commentsFriends(Global.getUserId())
                
                $scope.scoreFeeds = ActivityService.getScoreFeeds($scope.user._id);
                
                $scope.subscriptions = []
                
                //$scope.notifications = ActivityService.notifications($scope.user.subscribedPlayers)
                
                $scope.setCurrentFeed = function(feedId){
                         $state.transitionTo('private.feed', {_id: feedId})
                }
                
                $scope.go = function(index){               
                      $ionicSlideBoxDelegate.slide(index)
                }
                
                $scope.comment = function(msg, type){
                       ActivityService.create({message: msg, _user:$scope.user, feedType: type});
                       setTimeout(function(){                        
                        $scope.scoreFeeds = ActivityService.getScoreFeeds($scope.user._id);
                       }, 1000)
                     
                }
        
        })