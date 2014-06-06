'use strict';

Afrikik
        .controller('ActivityCtrl', function($scope, $timeout, $state, $stateParams, $ionicSlideBoxDelegate, ActivityService, Global) {
                
                $scope.activities = ActivityService.feedsSubscribed(Global.getUserId());
                
                $scope.user = Global.getUser()
                
                if ($stateParams._id) {
                        $scope.feed = ActivityService.getByFeedById($stateParams._id);
                }
                var limit = 5;
                
                function callback(data){
                     $scope.communities = data                                  
                }
                $scope.communities  = ActivityService.getCommunityFeeds(callback, $scope.user._id, 0, limit)
                console.log('list communitoies  : '+ $scope.communities.length)
                
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
                       ActivityService.create({message: msg, _user:$scope.user._id, feedType: type});
                       setTimeout(function(){
                        if (type=='score') {
                                $scope.scoreFeeds = ActivityService.getScoreFeeds($scope.user._id);
                        }else{
                                $scope.communities = ActivityService.getCommunityFeeds(callback, $scope.user._id, 0, limit);
                        }
                        
                       }, 1000)
                     
                }
                
                // Method called on infinite scroll
                
                $scope.stopScroll = false;  //
                
                $scope.loadMoreCommunity = function() {                
                  $timeout(function() {
                    if (!$scope.stopScroll) {
                        ActivityService.getCommunityFeeds(function (data){
                            if (data.length==0) {
                                $scope.stopScroll=true
                            }
                            data.forEach(function(obj){
                                $scope.communities.push(obj);
                            })
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        },$scope.user._id, $scope.communities.length, limit);
                    }
                    
                  }, 1000);
        
                }
        
        })