'use strict';

Afrikik
        // A simple controller that fetches a list of data from a service
        .controller('MemberCtrl', function($ionicLoading, $stateParams, $window, config,$scope, $state, $timeout, $ionicSlideBoxDelegate, Global, MemberService, TeamService, PlayerService,SettingsService, envConfiguration) {
                
                $scope.avatars = ['default.png','a1.png','a2.png','a3.png','a4.png','a5.png','a6.png','a7.png','a8.png','a9.png','a10.png','a11.png']
                
                var apiDir =  config.apiDir;
                                
                $scope.user = Global.getUser()
                if ($stateParams._id) {
                        $scope.member = MemberService.getById($stateParams._id);
                }
                                
                $scope.setCurrentMember = function(member){
                         $state.transitionTo('private.member', {_id: member._id})
                }                        
                
                $scope.setCurrentPlayer = function(player){                        
                        $state.transitionTo('private.player', {_id: $stateParams._id})
                }
                
                $scope.subscribe = function(member){
                        $scope.user.following.push(member)
                        Global.setUser($scope.user);
                        $scope.isFriend ();
                }                        
                
                $scope.go = function(index){               
                      $ionicSlideBoxDelegate.slide(index)
                }
                $scope.styleLocked = {};                
                $scope.isFriend = function(member){
                        var testOK = false;
                        $scope.styleLocked = {};
                        $scope.user.following.forEach(function(friend){
                                if (friend._id == $stateParams._id) {
                                        testOK = true;
                                        return;
                                }                                
                        })
                        
                        if (testOK===false) {                                                                
                                $scope.member.following = _.first($scope.member.following, 2);
                                $scope.styleLocked = {'filter':'alpha(opacity=50)', 'opacity':0.5};
                        }
                        return testOK;
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
                
                $scope.update = function(user){
                        $ionicLoading.show({
                                template: '<i class="icon ion-loading-a"></i>'
                        });
                        MemberService.update({name:user.name, picture:user.picture}, function(value){
                                Global.setUser($scope.user)
                                $ionicLoading.hide()
                        },
                        function(err){
                                alert(err)
                        })
                }
                
                $scope.logout = function(){
                        $scope.user.password = '';
                        $scope.user.authenticated = false;
                        Global.setUser($scope.user)
                        $state.transitionTo('index')
                      //_gaq.push(['_trackEvent','Authentication', 'Logout', 'Regular Logout'])
                }
                      
                $scope.cleanCache = function(){
                   Global.setTopItems([]) //
                }
                
                $scope.getPicItem = function(item){
                        if (item&&item.img_url) {
                                return item.img_url
                        }
                        return  (item.picture)? apiDir + item.picture : './images/avatars/default.png';
                }
                                
                                
        })