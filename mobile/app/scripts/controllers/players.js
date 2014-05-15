'use strict';

Afrikik
        // A simple controller that fetches a list of data from a service
        .controller('PlayerCtrl', function($scope, $stateParams, $ionicSlideBoxDelegate, PlayerService) {
                // "Players" is a service returning mock data (services.js)          
                $scope.players = PlayerService.all();
                
                $scope.go = function(index){               
                      $ionicSlideBoxDelegate.slide(index)
                }
                
                $scope.career = "Didier Drogba, né le 11 mars 1978 à Abidjan, est un footballeur international ivoirien. Depuis janvier 2013 , il évolue au poste d'attaquant dans le club turc de Galatasaray."+

                                "Drogba débute sa carrière en France, au Mans Union Club 72. Il découvre la Ligue 1 avec l'En Avant de Guingamp, puis dispute ses premières rencontres européennes sous les couleurs de l'Olympique de Marseille. L'attaquant est transféré au Chelsea FC en 2004 et remporte notamment l'édition 2011-2012 de la Ligue des champions avec le club britannique. Après son départ, il est élu « meilleur joueur de l'histoire du club » par les supporters."+
                                
                                "Didier Drogba fait partie de l'équipe de Côte d'Ivoire depuis 2002. Il est nommé capitaine de la sélection, dont il est le meilleur buteur."+
                                
                                "Il possède également la nationalité française.";
                                                
        
        })