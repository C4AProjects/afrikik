'use strict';

Afrikik
        .controller('ActivityCtrl', function($scope, $state, $stateParams, $ionicSlideBoxDelegate, ActivityService, Global) {
                
                $scope.activities = ActivityService.feedsSubscribed(Global.getUserId());
                
                $scope.user = Global.getUser()
                
                if ($stateParams._id) {
                        $scope.feed = ActivityService.getByFeedById($stateParams._id);
                }
                                                       
                $scope.communities  = ActivityService.commentsFriends(Global.getUserId())
                
                $scope.subscriptions = []
                
                $scope.notifications = ActivityService.notifications($scope.user.subscribedPlayers)
                
                $scope.setCurrentFeed = function(feedId){
                        console.log('FEED ID :' + feedId)
                         $state.transitionTo('private.feed', {_id: feedId})
                }
                
                $scope.go = function(index){               
                      $ionicSlideBoxDelegate.slide(index)
                }
                
                $scope.comment = function(msg){
                       ActivityService.commentFeed({ _feed: $scope.feed, message: msg, _user:$scope.user});
                       setTimeout(function(){ // refresh the comment list                        
                        $scope.feed = ActivityService.getByFeedById($stateParams._id);
                       }, 1000)
                     
                }
        
        })