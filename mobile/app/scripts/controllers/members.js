'use strict';

Afrikik
        // A simple controller that fetches a list of data from a service
        .controller('MemberCtrl', function($stateParams, $window, config,$scope, $state, $timeout, $ionicSlideBoxDelegate, Global, MemberService, TeamService, PlayerService,SettingsService, envConfiguration) {
                
                
                $scope.apiDir =  config.apiDir;
                
                
                $scope.members = MemberService.all();
                
                $scope.setCurrentMember = function(member){
                        //MemberService.setCurrentMember(member)
                        //$scope.slide = $ionicSlideBoxDelegate.currentIndex();                        
                        $state.transitionTo('private.member', {_id: member._id})
                        //$scope.go($scope.slide)
                }
                
                $scope.user = Global.getUser()
                $scope.member = MemberService.getById($stateParams._id);
                
                $scope.setCurrentPlayer = function(player){                        
                        $state.transitionTo('private.player', {_id: $stateParams._id})
                }
                
                $scope.subscribe = function(member){
                        $scope.user.following.push(member)
                        Global.setUser($scope.user);
                        $window.location.reload(); //issue to review
                }
                
                $scope.go = function(index){               
                      $ionicSlideBoxDelegate.slide(index)
                }
                $scope.styleLocked = {};
                $scope.testOK = false;
                $scope.isFriend = function(member){                       
                        $scope.user.following.forEach(function(friend){
                                if (friend._id == member._id) {
                                        $scope.testOK = true;
                                        return;
                                }                                
                        })
                        
                        if ($scope.testOK===false) {                                
                                $scope.members = _.first($scope.members, 1);
                                $scope.member.following = _.first($scope.member.following, 2);
                                $scope.styleLocked = {'filter':'alpha(opacity=50)', 'opacity':0.5};
                        }
                        return $scope.testOK;
                }
                
                // Method called on infinite scroll                
                $scope.loadMore = function() {                
                  $timeout(function() {
                        
                    $scope.members.push({
                      id: 'tt0114814',
                      name: 'Didier Drogba',
                       description: 'A boat has been destroyed, criminals are dead, and the key to this mystery lies with the only survivor and his twisted, convoluted story beginning with five career crooks in a seemingly random police lineup.'                     
                    });
                    //console.log('infinite scroll pushed');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                  }, 1000);
        
                }
                
                $scope.moreDataCanBeLoaded = function(){
                        if ($scope.members.length>=25) {
                               
                               return false;
                        }
                        return true;
                }
                
                //$scope.players = PlayerService.all();
                                
                
                                    
                $scope.loadMore = function() {                
                  $timeout(function() {        
                    
                    //console.log('infinite scroll pushed');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                  }, 1000);
        
                }                
                                
        })