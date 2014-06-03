'use strict';

Afrikik
        // A simple controller that fetches a list of data from a service
        .controller('TeamCtrl', function($scope, $window, config, $state, $stateParams, $ionicSlideBoxDelegate, Global, TeamService, ActivityService) {
                
                var apiDir =  config.apiDir;
                         
                $scope.user = Global.getUser()
                
                $scope.message = "";
                $scope.players = [];
                
                $ionicSlideBoxDelegate.slide($scope.slide||1)
                
                console.log($ionicSlideBoxDelegate)
                                
                if($stateParams._id){
                        $scope.team = TeamService.getById($stateParams._id);
                        $scope.players = TeamService.playersTeam($stateParams._id)
                        $scope.activities = ActivityService.feedsTeam($stateParams._id)
                }                
                               
                
                $scope.go = function(index){               
                      $ionicSlideBoxDelegate.slide(index)
                }
                                
                $scope.post = function(msg){
                       TeamService.comment({ _team: $scope.team, message: msg, _user:$scope.user});
                       setTimeout(function(){                        
                        $scope.team = TeamService.getById($stateParams._id);
                       }, 1000)
                     
                }
                
                $scope.subscribe = function(team){
                        TeamService.subscribe(team._id)
                        $scope.user.subscribedTeams.push(team)
                        Global.setUser($scope.user);
                        $scope.isSubscribedOn();
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
                 
                $scope.styleLocked = {};
                $scope.isSubscribedOn = function(team){
                        $scope.styleLocked = {};
                        var test = false;
                        $scope.user.subscribedTeams.forEach(function(myteam){
                                if (myteam._id == $stateParams._id) {
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
