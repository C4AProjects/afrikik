'use strict';

Afrikik
        .controller('ActivityCtrl', function($cordovaSocialSharing, OpenFB, $scope, $rootScope, config, $ionicLoading, $timeout, $state, $stateParams, $ionicSlideBoxDelegate, ActivityService, Global) {
                
                var apiDir =  config.apiDir;
                
                var limit = 10;

		$scope.user = Global.getUser();
                $scope.feed = {}
                
                //SOCIAL MEDIA feature
                
                    $scope.shareFB = function (message) {
                        $ionicLoading.show({
                                        template: '<i class="icon ion-loading-a" ng-click=""></i>'
                        });
                        //$scope.feed.picture = $scope.feed.image;
                        //$scope.feed.link.picture = './images/logo.png';
                        OpenFB.login('email,read_stream,publish_stream,publish_actions').then(
                                function () {
                                    var feed = $scope.feed;
                                    feed.message = 'Afrikik.com ' + message;
                                    OpenFB.post('/me/feed', feed)
                                        .success(function () {
                                            //$scope.status = "This feed has been shared on OpenFB";
                                            $ionicLoading.show({
                                                    template: 'This feed shared on your facebook profile'
                                            });
                                            setTimeout(function(){
                                                  $ionicLoading.hide()
                                            }, 1500)
                                        })
                                        .error(function(data) {
                                            alert(data.error.message);
                                            $ionicLoading.hide()
                                        });
                    
                                },
                                function () {
                                    $scope.show("OpenFB login failed", 5000);
                                });
                    
                    }
                        
                   
                  
                    $scope.shareOnTW = function(message, image, link){
                      message = 'Afrikik.com ' + message + '';
                      if (message.length<140) {
                        message += ' @OfficialAfrikik';
                      }
                      $cordovaSocialSharing.shareViaTwitter(message, image, link).then(function(result) {
                          $ionicLoading.show({
                              template: 'Done!'
                          });
                          setTimeout(function(){
                            $ionicLoading.hide()
                          }, 1500)
                      }, function(err) {
                          // An error occured. Show a message to the user
                          $ionicLoading.show({
                              template: err
                          });
                          setTimeout(function(){
                            $ionicLoading.hide()
                          }, 2500)
                      });
                    }
                   
                   
                    $scope.shareOnFB = function(message, image, link){
                      message = '@Afrikik ' + message + '';
                      $cordovaSocialSharing.shareViaFacebook(message, image, link).then(function(result) {
                          $ionicLoading.show({
                              template: 'Done!'
                          });
                          setTimeout(function(){
                            $ionicLoading.hide()
                          }, 1500)
                      }, function(err) {
                          // An error occured. Show a message to the user
                          $ionicLoading.show({
                              template: err
                          });
                          setTimeout(function(){
                            $ionicLoading.hide()
                          }, 2500)
                      });
                    }
                    
                    $scope.shareOnWA = function(message, image, link){
                      message = '@OfficialAfrikik ' + message + '';
                      $cordovaSocialSharing.shareViaWhatsApp(message, image, link).then(function(result) {
                          $ionicLoading.show({
                              template: 'Done!'
                          });
                          setTimeout(function(){
                            $ionicLoading.hide()
                          }, 1500)
                      }, function(err) {
                          // An error occured. Show a message to the user
                          $ionicLoading.show({
                              template: err
                          });
                          setTimeout(function(){
                            $ionicLoading.hide()
                          }, 2500)
                      });
                    } 
                
                //

                
		$scope.activities=Global.getFeedsFromCache()||[];
		if($scope.activities && $scope.activities.length>0){
			var cacheDate=Global.getFeedsFromCacheDate();
			var diff = Math.round(Math.abs((cacheDate - Date.now())/(30000)));//30mins
			if(diff>30){
				ActivityService.feedsSubscribed(function(values){			
					$scope.activities = values;
					Global.setFeedsToCache(values);					
		
				}, Global.getUserId(), 0 , limit);
			}
		}else{
			ActivityService.feedsSubscribed(function(values){			
					$scope.activities = values;
					Global.setFeedsToCache(values);					
		
				}, Global.getUserId(), 0 , limit);
		}
                
                
                $scope.refresh = function(){
		ActivityService.feedsSubscribed(function(values){			
					$scope.activities = values;
					Global.setFeedsToCache(values);					
		
				}, Global.getUserId(), 0 , limit);
		}
                
                $rootScope.menuLeft = true;
                $scope.comments = [];
                $scope.feed = {}
                $scope.communities = []
                
                $scope.stopScrollComment = false;
                

                if ($stateParams._id) {
                        //console.log('params : '+ $stateParams._id)
                        $scope.feed = ActivityService.getByIdFromCache($stateParams._id)||ActivityService.getByFeedById($stateParams._id, function(feed){
                            $scope.feed = feed;
			    ActivityService.getCommentsFeed($stateParams._id, 0, limit, function (comments){
                                if(comments.length<limit) {
                                        $scope.stopScrollComment=true
                                 }
                                 $scope.comments = comments;
		                });                          
		        });
                        
                        
                        $rootScope.menuLeft = false;
                }
                
                
                
                $scope.stopScroll = false;  //
                
                function callback(data){
                     $scope.communities = data;
		     if(data && data.length < limit){
			$scope.stopScroll=true
		    }                                  
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
                        if (item.picture=='nopic-player.png') {
                                return './images/nopic-player.png';
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
                                                         ActivityService.getCommentsFeed($stateParams._id, 0, limit,
								function (comments){
								 $scope.comments = comments;
								});                  
                                                   	});
                                             
                     
                }
                
                // Method called on infinite scroll
                
                
                
                $scope.loadMoreCommunity = function() {                
                  $timeout(function() {
                    if (!$scope.stopScroll) {
                        ActivityService.getCommunityFeeds(function (data){
                            if (data && data.length==0) {
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
                            if (data && data.length==0) {
                                $scope.stopScrollFeed=true
                            }
                            data.forEach(function(obj){
                                $scope.activities.push(obj); 
 
                            })
                            $scope.$broadcast('scroll.infiniteScrollComplete');
			    if($scope.activities.length<50){
					Global.setFeedsToCache($scope.activities);
			    }
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
                
                //$scope.stopScrollComment = false;  //
                
                $scope.loadMoreComments = function() {                
                  $timeout(function() {
                    if (!$scope.stopScrollComment) {
                        ActivityService.getCommentsFeed($stateParams._id, $scope.comments.length, limit, function (comments){
                                 if (comments.length==0) {
                                        $scope.stopScrollComment=true
                                 }
                                 comments.forEach(function(obj){
                               		$scope.comments.push(obj);
                            	  })
                            $scope.$broadcast('scroll.infiniteScrollComplete');
		         });                  
                            
                    }
                    
                  }, 1000);
        
                }
        
        })
