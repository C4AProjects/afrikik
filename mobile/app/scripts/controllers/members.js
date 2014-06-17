'use strict';

Afrikik
        // A simple controller that fetches a list of data from a service
        .controller('MemberCtrl', function($ionicLoading, $stateParams, $window, config,$scope, $state, $timeout, $ionicSlideBoxDelegate, Global, MemberService, TeamService, PlayerService,SettingsService, envConfiguration) {
                
                $scope.avatars = ['default.png','a1.png','a2.png','a3.png','a4.png','a5.png','a6.png','a7.png','a8.png','a9.png','a10.png','a11.png']
                
                var apiDir =  config.apiDir;
                                
                $scope.user = Global.getUser()
                $scope.member = {}
                
                if ($stateParams._id) {
                       MemberService.getById($stateParams._id, function(data){
                                $scope.member = data
                                if ($scope.member&&$scope.member.following) {
                                        $scope.member.friends = $scope.member.following.concat($scope.member.followers)
                                }
                                if ($scope.member&&$scope.member.subscribedPlayers) {
                                        $scope.member.subscriptions = $scope.member.subscribedPlayers.concat($scope.member.subscribedTeams)
                                }
                        }, function(errors){
                                console.log(errors)
                        });
                       
                        
                }
                                
                $scope.setCurrentMember = function(member){
                         $state.transitionTo('private.member', {_id: member._id})
                }                        
                
                $scope.setCurrentItem = function(item){
                        if (item.position) {
                                $state.transitionTo('private.player', {_id: item._id})
                        }else {                                
                                $state.transitionTo('private.team', {_id: item._id})
                        }
                }
                
                $scope.subscribe = function(member){
                        $scope.user.following.push(member)
                        Global.setUser($scope.user);
                        $scope.isFriend ();
                }                        
                
                $scope.go = function(index){               
                      $ionicSlideBoxDelegate.slide(index)
                }

		$scope.subscribe = function(member){
                        MemberService.subscribe(member._id, function(values){
			     $scope.user.following.push(member)
			     Global.setUser($scope.user);
			     $scope.isFriend ()
			})                     
                }
                
                $scope.unsubscribe = function(member){
                        MemberService.unsubscribe(member._id, function(values){
			var list = []
                        $scope.user.following.forEach(function(item, index){
                                if (item._id!=member._id) {
                                        list.push(item)                                                
                                }                                
                        })
                        $scope.user.following = list;
                        Global.setUser($scope.user);
                        $scope.isFriend ()
			})
                        
                        
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
                
                $scope.update = function(settings){
                        $ionicLoading.show({
                                template: '<i class="icon ion-loading-a"></i>'
                        });
console.log(settings)
                        MemberService.update(settings, function(value){
				$scope.user.name = settings.name;
				$scope.user.picture = settings.picture;
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
			Global.setTopItems([]);
			Global.cleanAll();
                        $state.transitionTo('index')
                      //_gaq.push(['_trackEvent','Authentication', 'Logout', 'Regular Logout'])
                }
                      
                $scope.cleanCache = function(){
                        
                        $ionicLoading.show({
                                template: '<i class="icon ion-loading-a"></i>'
                        });
                        Global.setTopItems([]); //
                        Global.cleanAll();
                        
                        setTimeout(function(){
                                $ionicLoading.hide();
                        
                        },1500)
                        
                }
                
                $scope.getPicItem = function(item){
                        if (item&&item.img_url) {
                                return item.img_url
                        }
                        if (item.picture=='nopic-player.png') {
                                return './images/nopic-player.png';
                        }
                        return  (item.picture)? apiDir + item.picture :  './images/nopic-player.png';
                }
                
                                
                                
        })
