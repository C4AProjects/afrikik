'use strict';

Afrikik
        // A simple controller that fetches a list of data from a service
        .controller('MemberCtrl', function($scope, $stateParams, MemberService) {
          // "Members" is a service returning mock data (services.js)          
          $scope.members = MemberService.all();
          
        
        })

        .controller('SearchCtrl', function ($scope,MediaService,$ionicModal,$location,$ionicSideMenuDelegate,SettingsService) {
        $scope.navTitle = "iTunes Media Search";

        $scope.rightButtons =  [{
            type: 'button-icon button-clear ion-more',
            tap: function(e) {
                $scope.openSortModal();
            }
        }];
        $scope.request = {};
        $scope.showFlag = false;
        $scope.mediaTypes = {};
        $scope.mediaTypes.type = 'all';
        $scope.sortBy = "artistName";
        $scope.filterTerm = "";

        if ($scope.sideMenuController&&$scope.sideMenuController.isOpen())
            $scope.sideMenuController.toggleLeft();

        var doSearch = ionic.debounce(function(query) {
            var type = $scope.mediaTypes.type;
            if (type=="all")  type="";
            if (query!=null) {
                // Pass in the query string, the media type and the # of results to return (from SettingsService)
                MediaService.search(query,type,SettingsService.get('maxResults')).then(function(resp) {
                    $scope.mediaResults = resp;
                    console.log("Result Count " + $scope.mediaResults.resultCount);
                    $scope.mediaResults = resp;

                    if ($scope.mediaResults.resultCount == 0)
                        $scope.infoTxt = 'No matching results found';

                });
            }
        }, 500);


        $scope.search = function() {
            $scope.infoTxt = null;
            doSearch($scope.request.query);
        }

        $scope.checkMedia = function(item) {
            console.log("URL " + item.previewUrl + " " + item.kind);
            if (item.kind==='song' || item.kind==='music-video') {
                $scope.openPlayModal(item);
                $scope.infoTxt = null;
            }
            else $scope.infoTxt = 'No suitable player available for the selected media type.'

        };

        $ionicModal.fromTemplateUrl('templates/playModal.html', function(modal) {
            $scope.playModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        $scope.openPlayModal = function(item) {
            $scope.url = item.previewUrl;
            if  (item.trackName != null) $scope.title = item.trackName
            else $scope.title = item.collectionName;

            $scope.kind = item.kind;
            $scope.artist = item.artistName;
            $scope.playModal.show();
        }

        $scope.closePlayModal = function() {
            $scope.playModal.hide();
        }

        $ionicModal.fromTemplateUrl('templates/sortModal.html', function(sortModal) {
            $scope.sortModal = sortModal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        $scope.openSortModal = function() {
            $scope.sortModal.show();
        }

        $scope.closeSortModal = function() {
            $scope.sortModal.hide();
        }

        $scope.saveSort = function() {
            console.log("This filter " + this.filterTerm + " query " + $scope.request.query + " sort " + this.sortBy);
            $scope.filterTerm = this.filterTerm;
            $scope.sortBy = this.sortBy;
            $scope.sortModal.hide();
        }
})