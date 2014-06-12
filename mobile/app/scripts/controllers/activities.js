'use strict';

Afrikik
        .controller('ActivityCtrl', function($scope, $rootScope, config, $ionicLoading, $timeout, $state, $stateParams, $ionicSlideBoxDelegate, ActivityService, Global) {
                
                var apiDir =  config.apiDir;
                
                var limit = 10;
                
                $scope.activities = ActivityService.feedsSubscribed(Global.getUserId());
                
                $scope.user = Global.getUser();
                
                $rootScope.menuLeft = true;
                $scope.comments = [];
                $scope.feed = {}
                $scope.communities = []
                
                if ($stateParams._id) {
                        console.log('params : '+ $stateParams._id)
                        ActivityService.getCommentsFeed(function (data){
                                console.log(data)
                                $scope.comments = data;
                                
                        }, $stateParams._id, 0, 4);
                        
                        ActivityService.getByFeedById($stateParams._id, function(data){
                            $scope.feed = data                            
                        });
                        
                        
                        $rootScope.menuLeft = false;
                }
                
                
                
                
                
                function callback(data){
                     $scope.communities = data                                  
                }
                
                $scope.postFeedCommunity = function(message, feedType){
                        $ionicLoading.show({
                          template: '<i class="icon ion-loading-a"></i>'
                        });
                        ActivityService.create({message: message, feedType: feedType}, function(data){
                                ActivityService.getCommunityFeeds(callback, $scope.user._id, 0, limit);
                                $ionicLoading.hide()
                        })
                }
              
                
                ActivityService.getCommunityFeeds(callback, $scope.user._id, 0, limit);
                
                ActivityService.getCommunityFeeds(callback, $scope.user._id, 0, limit)
                
                ActivityService.getScoreFeeds(function callback(data){
                                        $scope.scores = data                                  
                                }, $scope.user._id, 0, limit);
                
                $scope.subscriptions = []
                
                //$scope.notifications = ActivityService.notifications($scope.user.subscribedPlayers)
                
                $scope.setCurrentFeed = function(feedId){
                         $state.transitionTo('private.feed', {_id: feedId})
                }
                
                $scope.go = function(index){               
                      $ionicSlideBoxDelegate.slide(index)
                }
                
                
                $scope.getPicItem = function(item){
                        if (item&&item.img_url) {
                                return item.img_url
                        }
                        return  (item.picture)? apiDir + item.picture : './images/nopic-player.png';
                }
                
                $scope.show = function(tpl, time) {
                        $ionicLoading.show({
                          template: tpl? tpl:'<i class="icon ion-loading-a"></i>'
                        });
                        setTimeout(function(){
                              $ionicLoading.hide();
                        },(time||1000))
                };
                
                $scope.comment = function(msg, type){
                        if (!msg||msg.length<5) {
                             $scope.show('<span style="color:red;font-weight:bold">A message is required before continuing! </span>  Minimum size :5', 2000)
                             return;
                        }
                       ActivityService.commentFeed({message: msg, _user:$scope.user._id, _feed:$scope.feed, feedType: type},
                                                   function(){
                                                        ActivityService.getByFeedById($scope.feed._id, function(data){
                                                                $scope.feed = data    
                                                        }); 
                                                   });
                                             
                     
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
                        },$scope.user._id, $scope.communities?$scope.communities.length:0, limit);
                    }
                    
                  }, 1000);
        
                }
                
                //infinite Scroll on feeds
                
                $scope.stopScrollFeed = false;  //
                
                $scope.loadMoreFeeds = function() {                
                  $timeout(function() {
                    if (!$scope.stopScrollFeed) {
                        ActivityService.feedsSubscribed(function (data){
                            if (data.length==0) {
                                $scope.stopScrollFeed=true
                            }
                            data.forEach(function(obj){
                                $scope.activities.push(obj);
                            })
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        },$scope.user._id, $scope.activities.length, limit);
                    }
                    
                  }, 1000);
        
                }
                
                 //infinite Scroll on scores
                
                $scope.stopScrollScore = false;  //
                
                $scope.loadMoreScores = function() {                
                  $timeout(function() {
                    if (!$scope.stopScrollScore) {
                        ActivityService.getScoreFeeds(function (data){
                            if (data.length==0) {
                                $scope.stopScrollScore=true
                            }
                            data.forEach(function(obj){
                                $scope.scores.push(obj);
                            })
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        },$scope.user._id, $scope.scores.length, limit);
                    }
                    
                  }, 1000);
        
                }
                
                 //infinite Scroll on scores
                
                $scope.stopScrollComment = false;  //
                
                $scope.loadMoreComments = function() {                
                  $timeout(function() {
                    if (!$scope.stopScrollComment) {
                        /*ActivityService.getCommentsFeed(function (data){
                            if (data.length==0) {
                                $scope.stopScrollComment=true
                            }
                            data.forEach(function(obj){
                                //$scope.scores.push(obj);
                            })
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        },$scope.user._id, $scope.scores.length, limit);*/
                    }
                    
                  }, 1000);
        
                }
        
        })