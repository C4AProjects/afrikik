'use strict';

angular.module('Afrikik')
   .controller('RefreshCtrl', function($scope, $window){
      $scope.refresh = function(){
	$window.location.reload();
      }
      
      $scope.forceSearch = function(){
	$window.location='#/private/search'
      }
      
      $scope.forceCommunity = function(){
	$window.location='#/private/feeds'
      }
      
   })
  .controller('MainCtrl',function ( $scope, $ionicSlideBoxDelegate, $filter, $rootScope,$state, User, authenticationService, envConfiguration, Global, ErrorHandler, $ionicLoading, PlayerService, MemberService, config, $window, $http, $location, OpenFB) {
      var Auth = authenticationService;
      
      $scope.go = function(index){               
	    $ionicSlideBoxDelegate.slide(index)
      }
      
      $scope.apiDir =  config.apiDir;
      
      $scope.isResetingPassword = false;
      
      $scope.isResendingConfirmationEmail = false;
      
      $scope.sendConfirmationEmail = function(){
	User.resendConfirmation({email:$scope.user.email},{}, function(response){
	    if (response) {
		$scope.show('<h4 style="font-weight:bold">Thank You for Registration To AFRIKIK,</h4>' +
			      '<br/> An Email is sent to <b>'+ $scope.user.email +'</b> for confirmation!', 3200)		  
	     $scope.isResendingConfirmationEmail = false;
	    }
	})
      } 
      
      $scope.resetPassword = function(){//TODO a landing page to create
	$scope.show('For now, please send an email to <span style="font-weight:bold;">contact@afrikik.com</span> for requesting a passcode!', 5000)
	//$scope.isResetingPassword = false;
      }
      
      $scope.refresh = function(){
	Global.cleanAll();
	$window.location.reload();
      }
      
      $scope.auth={
            email:'afrikik@afrikik.com',
            password:'tester'
      };
      
      $scope.user_new = {}
      
      
      
      $scope.isNavbarCollapsed = true;
      $scope.global= Global;
      
      $scope.user = Global.getUser()||{};
      if ($scope.user.authenticated) {
	if ($scope.user.subscribedPlayers&&$scope.user.subscribedPlayers.length>0) {
	    window.location = "#/private/subscriptions"
	}else{
	    window.location = "#/private/search"
	}   
	
      }
      
      
      $scope.search={};
      $scope.config = config;
      $scope.showLoginForm = false;
      
      $scope.goToCreateAccount = function () {
        $scope.$broadcast('slideBox.nextSlide');
      };
      
      $scope.goToTour = function (index) {
        $ionicSlideBoxDelegate.slide(index)
      };
      
      /*$scope.setCurrentPlayer = function(player){
	    PlayerService.setCurrentPlayer(player)
	    $state.go('private.member', {_id: member._id})
      }*/
      
     
    $scope.show = function(tpl, time) {
      $ionicLoading.show({
	template: tpl? tpl:'<i class="icon ion-loading-a"></i>'
      });
      setTimeout(function(){
	    $scope.hide();
      },(time||1000))
    };
    
    $scope.hide = function(){
      $ionicLoading.hide();
    };
    
    $scope.lockMember = function() {
      $ionicLoading.show({
	template: 'Subscribe to Unlock Member Information'
      });
    };
    
    /** SPLASH SCREEN
     *	xlarge (xhdpi): at least 960 x 720
	large (hdpi): at least 640 x 480
	medium (mdpi): at least 470 x 320
	small (ldpi): at least 426 x 320
     *
     */
    
    


    $scope.loginWithFB = function(){
	   $ionicLoading.show({
		template: '<i class="icon ion-loading-a" ng-click=""></i>'
	    });
	   
	   OpenFB.login('email,read_stream,publish_stream').then(
            function () {
		OpenFB.get('/me').success(function (user) {
                    	//console.log(user);
			$scope.user.name = user.name;
			$scope.user.email=user.email;
			$scope.user.username=user.email;
			Auth.loginWithFacebook($scope.user).then(function(loginResponse){
			    var user = loginResponse.user; // loginResponse.access_token.user
			    $rootScope.menuLeft = true;
			    user.authenticated = true;
			    window.user = user;		
			    Global.setUser(user)	    
			    if (user.subcribedPlayers&&user.subcribedPlayers.length>0) {
				$state.go('private.subscriptions')
			    }else{
				$state.go('private.search')
			    }
			    
			    $scope.show('Connexion...', 1000)
			})
                });

            },
            function () {
                $scope.show("OpenFB login failed", 5000);
            });

    }
    
    $scope.loginWithFBOld = function(){
	
	/*$http.defaults.xsrfHeaderName= 'value';
	$http.defaults.xsrfCookieName= 'dd';
	$http.defaults.useXDomain = true */
	console.log("*********************FACEBOOK LOGIN AUTH************************")
	$http.get('http://m-afrikik.c4adev.co.vu:2014/auth/facebook').success(function(a){
	    console.log("*********************FACEBOOK LOGIN SUCCESS************************")	    
	    console.log(a)
	    $scope.user.authenticated = true;
	    $state.go('private.search') 
	}).error(function(a){
	    console.log("*********************FACEBOOK LOGIN ERROR************************")
	    console.log(a)
	});
	/*$http({method: 'GET', url: 'http://localhost:2014/auth/facebook', 
            headers:{
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
                'X-Random-Shit':'123123123'
            }})
        .success(function(d){ console.log( "yay" ); })
        .error(function(d){ console.log( "nope" ); });*/
    }
  

    $scope.login=function(){
	$scope.show();
	
      _gaq.push(['_trackEvent','Authentication', 'Login', 'Regular Login', $scope.user.email, false])
      
      /*var authentication = */
      Auth.login($scope.user).then(function(loginResponse){
	
	$scope.isResetingPassword = false;
      
	$scope.isResendingConfirmationEmail = false;
	
	    if (!loginResponse) {
		$scope.hide();
		$scope.show('Server Error connection')		
	    }
            if(loginResponse.success)
            {
                var user = loginResponse.user; // loginResponse.access_token.user
		$rootScope.menuLeft = true;
		user.authenticated =true;
                window.user = user;		
		Global.setUser(user)

		if (user.subcribedPlayers&&user.subcribedPlayers.length>0) {
		$state.go('private.subscriptions')
		}else{
		    $state.go('private.search')
		}
		
		$scope.show('Connexion...', 1000)	
	    
		               
            }
            else
            {	if(loginResponse.shouldConfirm)
                  {
		    $scope.isResendingConfirmationEmail = true;
		    
		  }
		if(loginResponse.mayForgetPassword)
                  {
		    $scope.isResetingPassword = true;
		    
		  }
                
                if(loginResponse.alerts)
                  {
			$scope.alerts = loginResponse.alerts
			var tpl = '';
			$scope.alerts.forEach(function(alert){
			      tpl= tpl + alert.message + '<br/>'
			 })
			$scope.hide();
			$scope.show(tpl, 5000)						
                     //_gaq.push(['_trackEvent','Authentication', 'Login Failed', 'Regular Login'])
                  }
                else
                  {
                      var message = $filter('translate')('ERROR_SOMETHING_WENT_WRONG')
                      if(loginResponse && loginResponse.message && loginResponse.message.indexOf("Invalid resource owner credentials")>=0)
                      {
                          message = $filter('translate')('ERROR_WRONG_CREDENTIALS')
                          //_gaq.push(['_trackEvent','Authentication', 'Wrong Credentials', 'Regular Login', $filter('translate')('ERROR_WRONG_CREDENTIALS'), false])
                      }
                      $scope.alerts = [{
                        type:'danger',
                        message: message
                      }]
		      		     
		      var tpl = '';
		      $scope.alerts.forEach(function(alert){
			  tpl= tpl + alert.message + '<br/>'
		      })
		      $scope.hide();
		      $scope.show(tpl, 5000)
		      	
                  }
            }
	    $scope.user.password = ''
      });
              
    }

    $scope.logout = function(){
      Auth.logout().success(function(success){
	    $scope.user.password = '';
	    $scope.user.authenticated = false;
	    Global.setUser($scope.user)
	    $state.transitionTo('index')
          _gaq.push(['_trackEvent','Authentication', 'Login', 'Regular Logout', $scope.user.email, false])
      });

    }
    
    $scope.cleanCache = function(){
	_gaq.push(['_trackEvent','User Settings', 'Login', 'Clean user cache data', $scope.user.email, false])
       Global.setTopItems([]) //

    }
    
    $scope.exit = function(){	
       navigator.app.exitApp()
    }
    
    $scope.register = function(){
	$scope.show(null, 5000);
       $scope.user_new.username= $scope.user_new.username||$scope.user_new.email;//TODO
//console.log($scope.user_new);
    	User.save({}, $scope.user_new, function(response){
            console.log(response)
            if(response.success && !response.error){
                  //_gaq.push(['_trackEvent','Authentication', 'Registration Success', 'Regular Registration'])
                  //Successfully created the user, save it in the session
                  $rootScope.user = response;
                  $rootScope.user={};
                  $rootScope.user.email = $scope.user_new.email;
		  $scope.user = {email:$scope.user_new.email}
		  Global.setUser($scope.user)	
		  //$scope.user_new = {}; //init form
                  $scope.show('<h4 style="font-weight:bold">Thank You for Registration To AFRIKIK,</h4>' +
			      '<br/> An Email is sent to <b>'+ $scope.user.email +'</b> for confirmation!', 3200)
		  setTimeout(function(){
		    $window.location.reload();
		  }, 3250)
            }
            else
            {
			
                  var message = $filter('translate')('ERROR_SOMETHING_WENT_WRONG')
                  if(response.code == "11000")
                  {
                          
                        message = '<h4 style="font-weight:bold">An account already exists with that email address! Please choose a different email or if you forgot your password, you can recover it from the Login screen</h4>'
      			$scope.show(message, 5000)
                  }
if(response.code == "10000")
                  {
                          
                        message = '<h4 style="font-weight:bold">'+response.error+'</h4>'
      			$scope.show(message, 3000)
                  }
                  //Translate the messages
                  angular.forEach(response.alerts, function(alert, alertKey){
                        if(alert.msg == 'Email already exists')
                        {
                            alert.msg = $filter('translate')('ERROR_EMAIL_ALREADY_EXISTS')
                        }
                         if(alert.msg == 'Username already exists')
                        {
                            alert.msg = $filter('translate')('ERROR_USERNAME_ALREADY_EXISTS')
                        }
                       _gaq.push(['_trackEvent','Authentication', 'Registration Error', 'Regular Registration'])
                  })
                  $scope.alerts = response.alerts;
            }
    	}, function(response){
		$scope.show('<h4 style="font-weight:bold">An error is occured :,</h4>' +
			      '<br/> Sorry for this inconvenient!', 3000)
      })
    	_gaq.push(['_trackEvent','Registration', 'Registration', 'User Registration', $scope.user_new.email, false])
    }

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if(toState.name == 'login')
            {
              $scope.showLoginForm = true;
            }
            else
            {
              $scope.showLoginForm = false;
            }
	    
	     /*if ($scope.user&&$scope.user.email) {
		console.log('User authenticated before')
		//console.log($window)
		//$window.location('/private/search')
	      }else{
		$scope.user = {}
		console.log('User Not authenticated before')
	      }*/
      
    })

    ///Facebook Auth
    
    /*$scope.logout = function () {
            OpenFB.logout();
            $state.go('app.login');
    };*/

    $scope.revokePermissions = function () {
	OpenFB.revokePermissions().then(
	    function () {
		$state.go('app.login');
	    },
	    function () {
		alert('Revoke permissions failed');
	    });
    };
    
    $scope.facebookLogin = function () {

	OpenFB.login('email,read_stream,publish_stream').then(
	    function () {
		$location.path('/private/search');
	    },
	    function () {
		alert('OpenFB login failed');
	    });
    };
    
    $scope.item = {};

    $scope.share = function () {
	OpenFB.post('/me/feed', $scope.item)
	    .success(function () {
		$scope.status = "This item has been shared on OpenFB";
	    })
	    .error(function(data) {
		alert(data.error.message);
	    });
    };
    
    /**
     * $scope.show = function() {
	$scope.loading = $ionicLoading.show({
	    content: 'Loading feed...'
	});
    };
    $scope.hide = function(){
	$scope.loading.hide();
    };

    function loadFeed() {
	$scope.show();
	OpenFB.get('/' + $stateParams.personId + '/home', {limit: 30})
	    .success(function (result) {
		$scope.hide();
		$scope.items = result.data;
		// Used with pull-to-refresh
		$scope.$broadcast('scroll.refreshComplete');
	    })
	    .error(function(data) {
		$scope.hide();
		alert(data.error.message);
	    });
    }

    $scope.doRefresh = loadFeed;

    loadFeed();
     *
     */
    
});
  

