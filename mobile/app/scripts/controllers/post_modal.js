'use strict';

angular.module('Afrikik')
  .controller('AddPostModalCtrl',['$scope','$modalInstance','$filter','_','post','postRequest', function ($scope, $modalInstance, $filter,_, post, postRequest) {

    $scope.post=post;
    $scope.postRequest=postRequest;
    if($scope.postRequest.resolve)
    {
        if($scope.postRequest.type == 'no-fr')
        {
            $scope.post.word = $scope.postRequest.word

        }
        else
        {
            $scope.post.definition = $scope.postRequest.word
        }
    }

    $scope.translationOptions=[
        {
            value:'no-fr',
            label:$filter('translate')('NOUCHI_TO_FRENCH')
        },
        {
            value:'fr-no',
            label:$filter('translate')('FRENCH_TO_NOUCHI')
        }
    ];

    $scope.translationType = _.findWhere( $scope.translationOptions, {value:$scope.postRequest.type})
   
    $scope.submitPost=function(){
    	
    	$modalInstance.close($scope.post);
    }

    $scope.submitPostRequest=function(){
        
        $modalInstance.close($scope.postRequest);
    }
    
    $scope.cancel = function () {
       _gaq.push(['_trackEvent','Posts', 'Cancel', 'Cancelled A Post or Post Request Add', 0])
        $modalInstance.dismiss('cancel');

    };
   

  }]);
