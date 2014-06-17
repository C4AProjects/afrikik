'use strict';

Afrikik
        // A simple controller that fetches a list of data from a service
        .controller('TeamCtrl', function($scope, $window, config, $state, $rootScope, $stateParams, $ionicSlideBoxDelegate, Global, TeamService, ActivityService) {
                
                var apiDir =  config.apiDir;
                         
                $scope.user = Global.getUser()
                
                $scope.message = "";
                $scope.players = [];
                
                $ionicSlideBoxDelegate.slide($scope.slide||1)
                
                $rootScope.menuLeft = true;
                $scope.activities = []
                
                var limit = 10;
                
                function callback(data){
                     $scope.communities = data                                  
                }
                                
                if($stateParams._id){
                        $scope.team = TeamService.getById($stateParams._id);
                        $scope.players = TeamService.playersTeam($stateParams._id)
                        $scope.activities = ActivityService.feedsTeam(callback, $stateParams._id, 0, limit)
                        $rootScope.menuLeft = false;
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
                        Global.cleanAll();
                        $scope.isSubscribedOn();
                }
                
                $scope.unsubscribe = function(team){
                        TeamService.unsubscribe(team._id)
                        var list = []
                        $scope.user.subscribedTeams.forEach(function(item, index){
                                if (item._id!= team._id) {
                                        list.push(item)
                                        //delete $scope.user.subscribedTeams[index]                                        
                                }                                
                        })
                        $scope.user.subscribedTeams = list;
                        Global.setUser($scope.user);
                        Global.cleanAll();
                        $scope.isSubscribedOn();
                        
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
                 
                 $scope.getPicItem = function(item){
                        if (item.img_url) {
                                return item.img_url
                        }
                        if (item.picture=='nopic-team.png') {
                                return './images/nopic-team.png';
                        }
                        return  (item.picture)? apiDir + item.picture :'./images/nopic-team.png';
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
