'use strict';

Afrikik
        // A simple controller that fetches a list of data from a service
        .controller('PlayerCtrl', function($scope, $window, config, $state, $stateParams, $ionicSlideBoxDelegate, Global, PlayerService, ActivityService) {
                
                var apiDir =  config.apiDir;
                
                //$scope.players = $scope.players || PlayerService.all();
                
                $scope.items = []
                
                $scope.user = $scope.user||Global.getUser()
                
                $scope.message = "";
                                
                if($stateParams._id){
                        $scope.player = PlayerService.getByIdFromCache($stateParams._id)||PlayerService.getById($stateParams._id);
                }
                
                $scope.activities = ActivityService.all()
                
                $scope.activitiesPlayer = function(){
                        return ActivityService.activitiesPlayer($stateParams._id||null);
                }
                
                $scope.go = function(index){               
                      $ionicSlideBoxDelegate.slide(index)
                }
                
                $scope.post = function(msg){
                      ActivityService.addActivity({ _player: $scope.player._id, message: msg, createdAt: new Date(), _user:$scope.user});                      
                }
                
                $scope.subscribe = function(player){
                        $scope.user.subscribedPlayers.push(player)
                        Global.setUser($scope.user);
                        $window.location.reload();
                }
                
                $scope.getPicture = function(pic){                       
                        pic = (pic&&pic!='undefined')? apiDir + pic :'./images/no-player.png';
                        //console.log('bizar: ' +pic );
                        return pic;
                }
                
                $scope.setCurrentItem = function(item){
                        if (!item.country||item.nationality) {
                                //PlayerService.setCurrentPlayer(player)
                                $state.transitionTo('private.player', {_id: item._id})
                        }else {                                
                                $state.transitionTo('private.team', {_id: item._id})
                        }
                }
                
                $scope.setSubscribedItem = function(player){
                        //PlayerService.setCurrentPlayer(player)
                        $state.transitionTo('private.player', {_id: player._id})
                }                        
                 
                $scope.search = function(name){
                    /*$scope.items = _.filter(PlayerService.allItems(),  function(item){
                        return (item.name.toLowerCase().indexOf(name.toLowerCase()) >= 0)
                    })*/
                    $scope.items = PlayerService.itemsByName(name);
                }
                 
                $scope.styleLocked = {};
                $scope.isSubscribedOn = function(player){                        
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
        
        })