'use strict';

Afrikik
        // A simple controller that fetches a list of data from a service
        .controller('PlayerCtrl', function($scope, config, $state, $stateParams, $ionicSlideBoxDelegate, Global, PlayerService) {
                
                var apiDir =  config.apiDir;
                
                $scope.players = $scope.players || PlayerService.all();
                
                $scope.user = Global.getUser()
                                
                if($stateParams._id){
                        $scope.player = PlayerService.getById($stateParams._id);
                }
                
                $scope.activities = PlayerService.activities()
                
                $scope.activitiesPlayer =  PlayerService.activities($stateParams._id||0);
                
                $scope.go = function(index){               
                      $ionicSlideBoxDelegate.slide(index)
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
                
                $scope.setCurrentPlayer = function(player){
                        PlayerService.setCurrentPlayer(player)
                        $state.transitionTo('private.player', {_id: player._id})
                }                        
                 
                 $scope.search = function(name){
                    $scope.players = _.filter(PlayerService.all(),  function(player){
                        return (player.name.toLowerCase().indexOf(name.toLowerCase()) >= 0)
                    })
                 }
                 
                 $scope.isSubscribedOn = function(player){
                        var test = false;
                        $scope.user.subscribedPlayers.forEach(function(myplayer){
                                if (myplayer._id === player._id) {
                                        test = true;
                                        return;
                                }                                
                        })
                        $scope.styleLocked = {};
                        if (test===false) {
                                console.log('do copy')
                                //$scope.players = _.first($scope.members, 1);
                                //$scope.player.following = _.first($scope.member.following, 2);
                                //$scope.member.subscribedPlayers
                                $scope.styleLocked = {'filter':'alpha(opacity=50)', 'opacity':0.5};
                        }
                        return test;
                }
        
        })