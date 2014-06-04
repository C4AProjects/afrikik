'use strict';

angular.module('Afrikik')   
  .controller('MainCtrl',function ($scope, $ionicSlideBoxDelegate, $filter, $rootScope,$state, User, authenticationService, envConfiguration, Global, ErrorHandler, $ionicLoading, PlayerService, MemberService, config, $window, $http, $location) {
      var Auth = authenticationService;
      
      $scope.go = function(index){               
	    $ionicSlideBoxDelegate.slide(index)
      }
      
      $scope.apiDir =  config.apiDir;
      
      $scope.refresh = function(){
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
      console.log($scope.user)
      if ($scope.user.authenticated) {
	window.location = "#/private/search"
      }
      
      
      $scope.search={};
      $scope.config = config;
      $scope.showLoginForm = false;
      
      $scope.goToCreateAccount = function () {
        $scope.$broadcast('slideBox.nextSlide');
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
    
    $scope.loginWithFB = function(){
	
	/*$http.defaults.xsrfHeaderName= 'value';
	$http.defaults.xsrfCookieName= 'dd';
	$http.defaults.useXDomain = true */
	console.log("*********************FACEBOOK LOGIN AUTH************************")
	$http.get('http://m-afrikik.c4adev.co.vu:2014/auth/facebook').success(function(a){
	    console.log("*********************FACEBOOK LOGIN SUCCESS************************")
	    console.log(a)
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
	/*if ($scope.user.email!=$scope.auth.email || $scope.user.password!=$scope.auth.password) {	    
	    $scope.alerts = [{msg:'Email or password wrong!', type:'danger'}];
	    var tpl = '';
	    $scope.alerts.forEach(function(alert){
		tpl= tpl + alert.msg + '<br/>'
	    })
	    $scope.hide();
	    $scope.show(tpl)
	    setTimeout(function(){
		$scope.hide();
	    },1000)
	    
	    return;
	}
	
	Global.setUser($scope.user)*/
	
      //_gaq.push(['_trackEvent','Authentication', 'Login', 'Regular Login', $scope.auth.email, false])
      
      /*var authentication = */
      Auth.login($scope.user).then(function(loginResponse){
	    if (!loginResponse) {
		$scope.hide();
		$scope.show('Server Error connection')		
	    }
            if(loginResponse.success)
            {
                var user = loginResponse.user; // loginResponse.access_token.user
		user.authenticated =true;
                window.user = user;
		Global.setUser(user)			
                $state.go('private.search')    
            }
            else
            {	
                 
                if(loginResponse.alerts)
                  {
			$scope.alerts = loginResponse.alerts
			var tpl = '';
			$scope.alerts.forEach(function(alert){
			      tpl= tpl + alert.message + '<br/>'
			 })
			$scope.hide();
			$scope.show(tpl, 3000)						
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
	    user.authenticated = false;
	    $state.transitionTo('index')
          //_gaq.push(['_trackEvent','Authentication', 'Logout', 'Regular Logout'])
      });

    }
    
    $scope.register = function(){
       $scope.user_new.username= $scope.user_new.username||$scope.user_new.email;//TODO
    	var authentication = User.save($scope.user_new, function(response){
            console.log("New user created")
            if(response.success && !response.error){
                  //_gaq.push(['_trackEvent','Authentication', 'Registration Success', 'Regular Registration'])
                  //Successfully created the user, save it in the session
                  $rootScope.user = response;
                  $rootScope.user={};
                  $rootScope.user.email = $scope.user_new.email;
		  $scope.user = {email:$scope.user_new.email}
		  Global.setUser($scope.user)	
		  $scope.user_new = {}; //init form
                  $scope.show('<h4 style="font-weight:bold">Thank You for Registration To AFRIKIK,</h4>' +
			      '<br/> An Email is sent to <b>'+ $scope.user.email +'</b> for confirmation!', 3000)
		  setTimeout(function(){
		    $window.location.reload();
		  }, 3100)
            }
            else
            {
                  var message = $filter('translate')('ERROR_SOMETHING_WENT_WRONG')
                  if(response.code == "11000")
                  {
                          
                        message = "An account already exists with that email address! Please choose a different email or if you forgot your password, you can recover it from the Login screen"
      
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

      })
    	
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
  

