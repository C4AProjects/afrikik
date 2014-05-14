'use strict';

angular.module('Afrikik')   
  .controller('MainCtrl',['$scope', '$filter', '$rootScope', '$state', 'User','authenticationService','envConfiguration','Global', 'ErrorHandler', '$ionicLoading' ,function ($scope, $filter, $rootScope,$state, User, Auth, config, global, ErrorHandler, $ionicLoading) {
      $scope.auth={
            email:'afrikik@afrikik.com',
            password:'tester'
      };
      $scope.isNavbarCollapsed = true;
      $scope.global=global;
      $scope.user = global.getUser();
      $scope.search={};
      $scope.config = config;
      $scope.showLoginForm = false;
      
      $scope.goToCreateAccount = function () {
        $scope.$broadcast('slideBox.nextSlide');
      };
      //Remove
      $scope.user ={
            email:"afrikik@afrikik.com",
            username:"boobahsiddik",
            password:"tester",
            verifyPassword:"tester"
      }
     
    $scope.show = function() {
      $ionicLoading.show({
	template: '<i class="icon ion-loading-a"></i>'
      });
    };
    
    $scope.hide = function(){
      $ionicLoading.hide();
    };
    
    $scope.lockMember = function() {
      $ionicLoading.show({
	template: 'Subscribe to Unlock Member Information'
      });
    };
  

      $scope.login=function(){
	
	$scope.show();
	
      _gaq.push(['_trackEvent','Authentication', 'Login', 'Regular Login', $scope.auth.email, false])
      var authentication=Auth.login($scope.auth).then(function(loginResponse){
      //console.dir(loginResponse)
            if(loginResponse.success)
            {
                var user =  loginResponse.access_token.user
                window.user = user;
		//$scope.hide();
                //$state.transitionTo('private.member')    
            }
            else
            {	
                 
                  if(loginResponse.alerts)
                  {
                      $scope.alerts = loginResponse.alerts
                     _gaq.push(['_trackEvent','Authentication', 'Login Failed', 'Regular Login'])
                  }
                  else
                  {
                      var message = $filter('translate')('ERROR_SOMETHING_WENT_WRONG')
                      if(loginResponse && loginResponse.message.indexOf("Invalid resource owner credentials")>=0)
                      {
                          message = $filter('translate')('ERROR_WRONG_CREDENTIALS')
                          _gaq.push(['_trackEvent','Authentication', 'Wrong Credentials', 'Regular Login', $filter('translate')('ERROR_WRONG_CREDENTIALS'), false])
                      }
                      $scope.alerts = [{
                        type:'danger',
                        msg: message
                      }]
                  }
            }
      });
      setTimeout(function(){
	$scope.hide();
      },1000)
      $state.go('private.search');//TO REMOVE
    }

    $scope.logout = function(){
      Auth.logout().success(function(success){
          $state.transitionTo('posts')
          _gaq.push(['_trackEvent','Authentication', 'Logout', 'Regular Logout'])
      });

    }
    
    $scope.register = function(){
       
    	var authentication = User.save($scope.user, function(response){
            console.log("New user created")
            console.dir(response);
            if(response.success && !response.error){
                  _gaq.push(['_trackEvent','Authentication', 'Registration Success', 'Regular Registration'])
                  //Successfully created the user, save it in the session
                  $rootScope.user = response;
                  $rootScope.auth={};
                  $rootScope.auth.email = $scope.user.email;
                              $state.transitionTo('login')  			
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
    })

}]);
