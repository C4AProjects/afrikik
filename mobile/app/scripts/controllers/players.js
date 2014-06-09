'use strict';

Afrikik
        // A simple controller that fetches a list of data from a service
        .controller('PlayerCtrl', function($ionicNavBarDelegate,$angularCacheFactory,$scope, $rootScope, $window, config, $state, $stateParams, $ionicSlideBoxDelegate, Global, PlayerService, ActivityService) {
                
                var apiDir =  config.apiDir;
                
                //var playersCache = $angularCacheFactory('playersCache');
                
                
                
                $scope.user = $scope.user||Global.getUser()
       
                $rootScope.menuLeft = true;
                
                $scope.message = "";
                               
                if($stateParams._id){
                        $scope.player = PlayerService.getByIdFromCache($stateParams._id)||PlayerService.getById($stateParams._id);
                        $scope.activities = ActivityService.feedsPlayer($stateParams._id)
                        $rootScope.menuLeft = false;
                }
                
                var cachedItems = Global.getTopItems();
                
                if (cachedItems && cachedItems.length> 0) {
                        $scope.items = cachedItems;                        
                }
                else
                {
                        PlayerService.topItems(function(values, responseHeaders) {
                                $scope.items = values;
                                Global.setTopItems($scope.items) 
                        })                                                                                        
                        
                }
                
                
                
                $scope.go = function(index){               
                      $ionicSlideBoxDelegate.slide(index)
                }
                //$scope.communities = []
                $scope.post = function(msg){
                       PlayerService.comment({ _player: $scope.player, message: msg, _user:$scope.user});
                       setTimeout(function(){                        
                        $scope.player = PlayerService.getById($scope.player._id);
                       }, 1000)
                     
                }
                
                $scope.subscribe = function(player){
                        PlayerService.subscribe(player._id)
                        $scope.user.subscribedPlayers.push(player)
                        Global.setUser($scope.user);
                        //$window.location.reload();
                        $scope.isSubscribedOn();
                }
                
                $scope.unsubscribe = function(player){
                        PlayerService.unsubscribe(player._id)
                        var list = []
                        $scope.user.subscribedPlayers.forEach(function(item, index){
                                if (item._id!=player._id) {
                                        list.push(item)
                                        //delete $scope.user.subscribedPlayers[index]                                        
                                }                                
                        })
                        $scope.user.subscribedPlayers = list;
                        Global.setUser($scope.user);
                        $scope.isSubscribedOn();
                        
                }
                
                $scope.getPicture = function(pic){                       
                        pic = (pic&&pic!='undefined')? apiDir + pic :apiDir +'nopic-player.png';
                        return pic;
                }
                
                $scope.getPicItem = function(item){
                        if (item&&item.img_url) {
                                return item.img_url
                        }
                        return  (item.picture)? apiDir + item.picture : apiDir +'nopic-player.png';
                }
                
                $scope.setCurrentItem = function(item){
                        if (item.position) {
                                $state.transitionTo('private.player', {_id: item._id})
                        }else {                                
                                $state.transitionTo('private.team', {_id: item._id})
                        }
                }
                
                $scope.setSubscribedItem = function(player){
                        $state.transitionTo('private.player', {_id: player._id})
                }                        
                 
                $scope.search = function(name){
                    /*$scope.items = _.filter(PlayerService.allItems(),  function(item){
                        return (item.name.toLowerCase().indexOf(name.toLowerCase()) >= 0)
                    })*/
                    if (!name||name.length==0) {
                         $scope.items = PlayerService.topItems(function(values){
                                $scope.items = values;
                                Global.setTopItems($scope.items)                                                    
                        });
                    }else{
                        $scope.items = PlayerService.itemsByName(name);
                    }
                }
                
                
                 
                $scope.styleLocked = {};
                $scope.isSubscribedOn = function(player){
                        $scope.styleLocked = {};
                        var test = false;
                        $scope.user.subscribedPlayers.forEach(function(myplayer){
                                if (myplayer._id == $stateParams._id) {
                                        test = true;
                                        return;
                                }                                
                        })
                        
                        if (test===false) {
                                $scope.activities = _.first($scope.activities, 2)
                                $scope.styleLocked = {'filter':'alpha(opacity=50)', 'opacity':0.5};
                        }
                        return test;
                }
                
                 $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                        $ionicNavBarDelegate.showBackButton(true)
                 })
                
        })