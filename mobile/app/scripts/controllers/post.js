'use strict';

angular.module('Afrikik')
  .controller('PostsCtrl',['_','$scope','Post','$stateParams','$state','$modal','Global','User','post',function (_, $scope, PostResource, $stateParams, $state,$modal,Global, User,post) {
    $scope.posts = [];
    $scope.post=post;
    $scope.postCount=$scope.posts.length;
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.loading = false;
    $scope.showAddForm=false;
    $scope.user = Global.getUser();

    $scope.numberOfPages=function(){
        return Math.ceil($scope.postCount/$scope.pageSize);                
    }
    /**
     * Loads the posts using a paging system in
     */  
    $scope.loadPosts=function(){
    	if($scope.loading)
		{
		 return;
		}
    	$scope.loading=true;
    	if ($state.current.name == 'posts'){
	    	 PostResource.query({limit:$scope.pageSize,skip:$scope.currentPage * $scope.pageSize,sort:'-created', populate:'creator' },function(postList){
	    		 //Add the new items to the list
	    	        for(var i=0;i<postList.length;i++)
	    	        {
	    	        	$scope.posts.push(postList[i])
	    	        }
	    	        $scope.postCount = $scope.posts.length;
	    	        $scope.currentPage += 1;
	    	        $scope.loading=false;
                    findLikedPosts();
                   _gaq.push(['_trackEvent','Posts', 'Load', 'Loaded More Posts', $scope.posts.length])
	    	    }) 
	    }
    	
    }

    $scope.viewPost=function(post){
       _gaq.push(['_trackEvent','Posts', 'View', 'Viewed A Post', $scope.post.page_views, false])
        $state.transitionTo('posts.view',{postId:post._id});
    }
    
    $scope.create=function(){
    	$scope.post.created = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
    	$scope.post.modified = $scope.post.created;
    	$scope.post.is_from_request = false;
    	var newPost =  new PostResource($scope.post)
    	newPost.$save(function(newPost){
    		$scope.posts.unshift(newPost);
    		$scope.post={};
           _gaq.push(['_trackEvent','Posts', 'Create', 'Created A Post', $scope.post.page_views])
    	});
    }
    
    $scope.give_props=function(post){
    	if(!post.props)
		{
    		post.props = 0
		}
    	post.props += 1;
    	var updatedPost =  new PostResource(post)

    	User.like({postId:updatedPost._id},{}, function(updatedPost){
            post.is_liked=true;
            angular.extend(post, updatedPost)
            _trackEvent('Posts', 'Liked', 'Liked A Post', post.likes.count)
           
    	});
    }

    $scope.openAddPostModal = function () {

        var addPostModalInstance = $modal.open({
          templateUrl: '/app/views/partials/add_post.html',
          controller: 'AddPostModalCtrl',
          resolve: {
            post: function () {
                return $scope.post;
            },
            postRequest: function () {
                return {};
            }
          }

        });
        _gaq.push(['_trackEvent','Posts', 'Create', 'Create A Post', 0])
        addPostModalInstance.result.then(function (post) {
            $scope.post = post;
            $scope.create();
        }, function () {
          console.info('Modal dismissed at: ' + new Date());
        });
    };
    
    function findLikedPosts(){
       _.each($scope.posts, function(post, index){
            console.dir(post.likes)
            console.log(Global.getUserId())
            if( _.find(post.likes, function(id){ return id == Global.getUserId(); })){
                post.is_liked=true;
                console.log("Post %s is liked", post._id)
            }

        })
    }

    $scope.$on('$stateChangeSuccess', 
    function(event, toState, toParams, fromState, fromParams){ 
        if(toState.name == "posts.view")
        {
            post.page_views += 1;
            var updatedPost =  new PostResource(post)
            updatedPost.$update({}, function(updatedPost){
                post=updatedPost;
            });
        }
    })
    
   findLikedPosts()

  }]);
