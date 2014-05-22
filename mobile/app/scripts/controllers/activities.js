'use strict';

Afrikik
        .controller('ActivityCtrl', function($scope, $stateParams, $ionicSlideBoxDelegate, ActivityService) {
                $scope.activities = ActivityService.all();
                
                $scope.go = function(index){               
                      $ionicSlideBoxDelegate.slide(index)
                }               
                                                
        
        })