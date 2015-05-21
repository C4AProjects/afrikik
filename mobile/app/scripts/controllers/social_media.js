Afrikik.controller('SocialMedia', function($scope, $cordovaSocialSharing, Global, $ionicLoading, OpenFB) {
  
  $scope.user = Global.getUser();
  
  $scope.shareFB = function (message) {
      $scope.feed = {message:'@Afrikik ' + message + ' afrikik.com'};
      OpenFB.post('/me/feed', $scope.feed)
          .success(function () {
              $scope.status = "This feed has been shared on OpenFB";
          })
          .error(function(data) {
              alert(data.error.message);
          });
  };

  $scope.shareOnTW = function(message, image, link){
    message = '@Afrikik ' + message + '';
    $cordovaSocialSharing.shareViaTwitter(message, image, link).then(function(result) {
        $ionicLoading.show({
            template: 'Done!'
        });
        setTimeout(function(){
          $ionicLoading.hide()
        }, 1500)
    }, function(err) {
        // An error occured. Show a message to the user
        $ionicLoading.show({
            template: err
        });
        setTimeout(function(){
          $ionicLoading.hide()
        }, 2500)
    });
  }
 
 
  $scope.shareOnFB = function(message, image, link){
    message = '@Afrikik ' + message + '';
    $cordovaSocialSharing.shareViaFacebook(message, image, link).then(function(result) {
        $ionicLoading.show({
            template: 'Done!'
        });
        setTimeout(function(){
          $ionicLoading.hide()
        }, 1500)
    }, function(err) {
        // An error occured. Show a message to the user
        $ionicLoading.show({
            template: err
        });
        setTimeout(function(){
          $ionicLoading.hide()
        }, 2500)
    });
  }
  
  $scope.shareOnWA = function(message, image, link){
    message = '@Afrikik ' + message + '';
    $cordovaSocialSharing.shareViaWhatsApp(message, image, link).then(function(result) {
        $ionicLoading.show({
            template: 'Done!'
        });
        setTimeout(function(){
          $ionicLoading.hide()
        }, 1500)
    }, function(err) {
        // An error occured. Show a message to the user
        $ionicLoading.show({
            template: err
        });
        setTimeout(function(){
          $ionicLoading.hide()
        }, 2500)
    });
  } 
  


  /*$cordovaSocialSharing.shareViaWhatsApp(message, image, link).then(function(result) {
      // Success! 
  }, function(err) {
      // An error occured. Show a message to the user
  });


  $cordovaSocialSharing.shareViaFacebook(message, image, link).then(function(result) {
      // Success! 
  }, function(err) {
      // An error occured. Show a message to the user
  });

  // access multiple numbers in a string like: '0612345678,0687654321'
  $cordovaSocialSharing.shareViaSMS(message, number).then(function(result) {
      // Success! 
  }, function(err) {
      // An error occured. Show a message to the user
  });

  // TO, CC, BCC must be an array, Files can be either null, string or array
  $cordovaSocialSharing.shareViaEmail(message, subject, toArr, bccArr, file).then(
    function(result) {
      // Success! 
    }, function(err) {
      // An error occured. Show a message to the user
    });


  $cordovaSocialSharing.canShareVia(socialType, message, image, link).then(
    function(result) {
      // Success! 
    }, function(err) {
      // An error occured. Show a message to the user
    });
    */
});