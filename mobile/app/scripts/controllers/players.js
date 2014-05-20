'use strict';

Afrikik
        // A simple controller that fetches a list of data from a service
        .controller('PlayerCtrl', function($scope, config, $state, $stateParams, $ionicSlideBoxDelegate, PlayerService) {
                
                var apiDir =  config.apiDir;
                
                $scope.players = PlayerService.all();
                                
                $scope.player = PlayerService.getById($stateParams._id||0);
                
                $scope.activities = PlayerService.activities($scope.player._id||0)
                
                $scope.go = function(index){               
                      $ionicSlideBoxDelegate.slide(index)
                }
                
                $scope.getPicture = function(pic){                       
                        pic = (pic&&pic!='undefined')? apiDir + pic :'./images/no-player.png';
                        //console.log('bizar: ' +pic );
                        return pic;
                }
                
                $scope.setCurrentPlayer = function(player){
                        PlayerService.setCurrentPlayer(player)
                        $state.transitionTo('private.player')
                }                        
                                                
        
        })