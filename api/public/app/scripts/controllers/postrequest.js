'use strict';

angular.module('nouchiapiApp')
  .controller('PostRequestsCtrl', ['$scope', 'PostRequest','Post','requests','$state','$modal','Global', function ($scope, PostRequest,Post, requests, $state, $modal, Global) {
    $scope.requests = requests;
    $scope.request={};
    $scope.postRequest={
        type:'no-fr'
    };
    $scope.requestCount=$scope.requests.length;
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.loading = false;
    $scope.showAddRequestForm=false;
    $scope.numberOfPages=function(){
        return Math.ceil($scope.postRequestCount/$scope.pageSize);                
    }
    /**
     * Loads the posts using a paging system in
     */  
    $scope.loadRequests=function(){
    	if($scope.loading)
		{
		  return;
		}
    	$scope.loading=true;

         PostRequest.query({limit:$scope.pageSize,skip:$scope.currentPage * $scope.pageSize,sort:'-created', populate:'creator' },function(requestList){
                //Add the new items to the list for the infinite scroll
                for(var i=0;i<requestList.length;i++)
                {
                    $scope.requests.push(requestList[i])
                }
                $scope.requestCount = $scope.requests.length;
                $scope.currentPage += 1;
                $scope.loading=false;
               _gaq.push(['_trackEvent','Post Requests', 'Load', 'Loaded More Post Requests', $scope.requestCount])
            }) 

    }


    $scope.openAddPostRequestModal = function () {

        var addPostModalInstance = $modal.open({
          templateUrl: '/app/views/partials/add_post_request.html',
          controller: 'AddPostModalCtrl',
          resolve: {
            postRequest: function () {
              return $scope.postRequest;
            },
            post: function () {
                return {};
            },
          }
         
        });
       _gaq.push(['_trackEvent','Post Requests', 'Add', 'Try To Add Post Request', 0])
        addPostModalInstance.result.then(function (postRequest) {
            $scope.postRequest = postRequest;
            $scope.create();
        }, function () {
          console.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.openResolvePostRequestModal = function (request, index) {
        $scope.postRequest = request;
        var resolvePostModalInstance = $modal.open({
          templateUrl: '/app/views/partials/resolve_post_request.html',
          controller: 'AddPostModalCtrl',
          resolve: {
            postRequest: function () {
                request.resolve=true;
                return request;
            },
            post: function () {
                return {};
            },
          }
        });
       _gaq.push(['_trackEvent','Post Requests', 'Resolve', 'Resolve A Post Request', 0])
        resolvePostModalInstance.result.then(function (post) {
            $scope.post = post;
            $scope.resolveRequest(post, index);
        }, function () {
          console.info('Modal dismissed at: ' + new Date());
        });
    };
    

    $scope.resolveRequest=function(post, index){
        var newPost = new Post(post);
        newPost.$save(function(post){
            var postRequest =  new PostRequest($scope.postRequest);
            postRequest.resolver = Global.getUserId();
            postRequest.active=false;
            postRequest.$update(function(postRequest){
               _gaq.push(['_trackEvent','Post Requests', 'Resolved', 'Resolved A Post Request', 0])
                $state.transitionTo('posts.view', {postId:post._id})
            })
        })

        

    }
    
    $scope.create=function(){
    	$scope.postRequest.is_from_request = false;
    	var newPostRequest =  new PostRequest($scope.postRequest)
    	newPostRequest.$save(function(newPostRequest){
    		$scope.requests.unshift(newPostRequest);
    	  _gaq.push(['_trackEvent','Post Requests', 'Added', 'Added New Post Request', 0])
    		
    	});
    }
  }]);
