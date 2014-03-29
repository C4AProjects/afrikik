'use strict';

angular.module('nouchiapiApp', ['config','angularLocalStorage','ui.router','ui.bootstrap','ngResource',"ngAnimate",'infinite-scroll','pascalprecht.translate','underscore'])

  	.config(function ( $stateProvider, $urlRouterProvider, $translateProvider,$httpProvider,$provide, envConfiguration) {
    
	    //$urlRouterProvider.otherwise("/posts") 
	    // Now set up the states
	    $stateProvider
	    .state('index', {
	          abstract:true,
	          views:{
		    	'applicationContainer':{
		    		templateUrl: "/app/views/main.html",  
		    		controller:'MainCtrl'
		    	},

		    	

		    }   
	    })
	    .state('posts', {
	        	url: "/posts",
	          	parent:'index',
	          	views:{
	          		'layoutContainer@index':{
		    		 	templateUrl: "/app/views/posts/list.html",  
		    		 	controller:'PostsCtrl'
		    		}	
		    	},
		    	resolve:{
			    	post:['Post','$q','$stateParams',function(Post,$q,$stateParams){
			    		var post={}
			    		return post;
			    	}]
			    }
	    })
	    .state('posts.view', {
	        	url: "/posts/:postId",
	          	parent:'posts',
	          	views:{
	          		'layoutContainer@index':{
		    		 	templateUrl: "/app/views/posts/view.html",  
		    		 	controller:'PostsCtrl'
		    		}	
		    	},
		    	resolve:{
			    	post:['Post','$q','$stateParams',function(Post,$q,$stateParams){
			    		var postPromise = $q.defer();
			    		var post
			    		 Post.get({id:$stateParams.postId},function(post){
			    		 	console.dir(post)
			    		 	postPromise.resolve(post)
			    	    }, function(error){
			    	    	console.dir(error)
			    	    	postPromise.reject(error)
			    	    }) 
			    		 return postPromise.promise;
			    	}]
			    }
	    })
	    .state('requests', {
	          	url: "/postrequests",
	         	parent:'index',
	         	views:{         		
		          	'layoutContainer@index':{
			    		templateUrl: "/app/views/requests/list.html",  
			    		controller:'PostRequestsCtrl'
			    	}
			    },	
			    resolve:{
			    	requests:['PostRequest','$q',function(PostRequest,$q){

			    		var requestsListPromise = $q.defer();
			    		 PostRequest.query({limit:10,skip:0,sort:'-created', populate:'creator' },function(requests){
			    		 	console.dir(requests)
			    		 	requestsListPromise.resolve(requests)
			    	    }, function(error){
			    	    	console.dir(error)
			    	    	requestsListPromise.reject(error)
			    	    }) 
			    		 return requestsListPromise.promise;
			    	}]
			    }
	    })
	    .state('login', {
	          	url: "/login",
	          	parent:'index',
	          	views:{
	          		
		          	'layoutContainer@index':{
			    		 templateUrl: "/app/views/auth/login.html",  
			    		 controller:'MainCtrl'
			    	}
			    }

	    })
	    .state('register', {
	          	url: "/register",
	          	parent:'index',
	          	views:{
		          	'layoutContainer@index':{
			    		 templateUrl: "/app/views/auth/register.html",  
			    		 controller:'MainCtrl'
			    	}	
			    }
	    })
	    .state('search', {
	          	url: "/search",
	          	parent:'index',
	          	views:{
		          	'layoutContainer@index':{
			    		 templateUrl: "/app/views/auth/register.html",  
			    		 controller:'MainCtrl'
			    	}	
			    }
	    })
 		.state('user', {
	          	url: "/user/:id",
	         	parent:'index',
	         	views:{
		          	'layoutContainer@index':{
			    		 templateUrl: "/app/views/users/me.html",  
			    		 controller:'UserCtrl'
			    	}
			    },
			    resolve:{
			    	user:['User','$q','$stateParams', function(User,$q, $stateParams){

			    		var userPromise = $q.defer();
			    		 User.get({id:$stateParams.id},function(user){
			    		 	_trackEvent('User', 'View', 'View Public Profile', 0)
			    		 	userPromise.resolve(user)
			    	    }, function(error){
			    	    	console.dir(error)
			    	    	userPromise.reject(error)
			    	    }) 
			    		 return userPromise.promise;
			    	}]
			    }	

	    })
	    .state('me', {
	          	url: "/me",
	          	parent:'index',
	          	views:{
		          	'layoutContainer@index':{
			    		 templateUrl: "/app/views/users/me.html",  
			    		 controller:'UserCtrl'
			    	}
			    },
			    resolve:{
			    	user:['User','$q','Global', function(User,$q, Global){

			    		var userPromise = $q.defer();
			    		 User.me({id:Global.getUserId()},function(user){
			    		 	_trackEvent('User', 'View', 'View Personal Profile', 0)
			    		 	userPromise.resolve(user)
			    	    }, function(error){
			    	    	console.dir(error)
			    	    	userPromise.reject(error)
			    	    }) 
			    		 return userPromise.promise;
			    	}]
			    }	
	    })

	      
	      $translateProvider.translations('en', {
	    	'NAVIGATION_MENU_POSTS_OPTION':'Posts', 
	    	'NAVIGATION_MENU_REQUESTS_OPTION':'Requests', 
	    	'NAVIGATION_MENU_SEARCH_OPTION':'Search',
	    	'NAVIGATION_MENU_MORE_OPTION':'More',
	    	'NAVIGATION_MENU_LOGIN_OPTION':'Login',
	    	'NAVIGATION_MENU_LOGOUT_OPTION':'Logout',
	    	'NAVIGATION_MENU_MY_ACCOUNT_OPTION':'My Account',
		    'WORDS_HEADER': 'Last Words',
		    'SEARCH_HEADER':'Search',
		    'REQUESTS': 'Requests',
		    'POSTS':'Posts',
		    'ADD_POST_FORM_WORD_LABEL': 'Word or Expression',
		    'RESOLVE_POST_FORM_WORD_LABEL': 'Word or Expression',
		    'ADD_POST_FORM_DEFINITION_LABEL': 'Definition',
		    'ADD_POST_FORM_EXAMPLE_LABEL': 'Example',
		    'ADD_POST_FORM_SUBMIT_BTN_LABEL':'Add',
		    'ADD_POST_FORM_CANCEL_BTN_LABEL':'Cancel',
		    'ADD_LABEL':'Add',
		    'ADD_POST_FORM_LEGEND':'Add a word or expression Afrikik',
		    'RESOLVE_POST_FORM_LEGEND':'Resolve a Request',
		    'ADD_POST_FORM_WORD_REQUIRED_ERROR':'This field is required',
		    'ADD_POST_FORM_DEFINITION_REQUIRED_ERROR':'This field is required',
		    'ADD_POST_FORM_EXAMPLE_REQUIRED_ERROR':'This field is required',
		    'ADD_POST_REQUEST_FORM_LEGEND':'Ask for a translation',
		    'ADD_POST_REQUEST_FORM_WORD_LABEL':'Word or Expression',
		    'ADD_POST_REQUEST_FORM_WORD_REQUIRED_ERROR':'This is a required field',
		    'ADD_POST_REQUEST_FORM_TRANSLATION_TYPE_LABEL':'Translation Type',
		    'ADD_POST_REQUEST_FORM_TRANSLATION_TYPE_REQUIRED_ERROR':'This is a required field',
		    'ADD_POST_REQUEST_FORM_SUBMIT_BTN_LABEL':'Submit',
		    'ADD_POST_FORM_TRANSLATED_FROM_LABEL':'Translated from',
		    'FORM_CANCEL_BTN_LABEL':'Cancel',
		    'POST_BY':'by',
		    'POST_VIEWS':'views',
		    'POST_VIEW':'View',
		    'POST_PROPS':'props',
		    'POST_PROPSIT':'Props It',
		    'ANONYMOUS':'Anonymous',
		    'FAVORITES':'Likes',
		    'EMAIL_ADDRESS':'Email Address',
		    'PASSWORD':'Password',
		    'USERNAME':'Username',
		    'BACK':'Back',
		    'CONFIRM_PASSWORD':'Confirm Password',
		    'LOGIN_FORM_SIGNIN': 'Sign In',
		    'LOGIN_FORM_LOGIN_WITH_FACEBOOK': 'Login with Facebook',
		    'LOGIN_FORM_EMAIL_REQUIRED_ERROR': 'Please enter your email address',
		    'LOGIN_FORM_PASSWORD_REQUIRED_ERROR': 'Please enter your password',
		    'LOGIN_FORM_PASSWORD_MATCH_ERROR': 'The entered passwords do not match!',
		    'REGISTER_FORM_REGISTER': 'Register',
		    'ERROR_EMAIL_ALREADY_EXISTS':'Email already exists!',
		    'ERROR_USERNAME_ALREADY_EXISTS':'Username already exists!',
		    'ERROR_WRONG_CREDENTIALS':'The username/password you entered are not valid!',
		    'ERROR_SOMETHING_WENT_WRONG':'Something went terribly, terribly wrong...Try again!',
		    'RESOLVE':'Resolve',
		    'NOUCHI_TO_FRENCH':'French to Afrikik',
		    'FRENCH_TO_NOUCHI':'Afrikik to French'




		    
		  });
	    	$translateProvider.translations('fr', {
    		'NAVIGATION_MENU_POSTS_OPTION':'Mots', 
	    	'NAVIGATION_MENU_REQUESTS_OPTION':'Requêtes',
	    	'NAVIGATION_MENU_SEARCH_OPTION':'Recherche',
	    	'NAVIGATION_MENU_MORE_OPTION':'Plus',
	    	'NAVIGATION_MENU_LOGIN_OPTION':'Connexion',
	    	'NAVIGATION_MENU_LOGOUT_OPTION':'Deconnexion',
	    	'NAVIGATION_MENU_MY_ACCOUNT_OPTION':'Mon Compte',
		    'WORDS_HEADER': 'Derniers Mots',
		    'SEARCH_HEADER':'Recherche',
		    'REQUESTS': 'Requêtes',
		    'POSTS':'Soumissions',
		    'ADD_POST_FORM_WORD_LABEL': 'En Afrikik, le mot ou l\'expression',
		    'RESOLVE_POST_FORM_WORD_LABEL': 'Le mot ou l\'expression',
		    'ADD_POST_FORM_DEFINITION_LABEL': 'veut dire',
		    'ADD_POST_FORM_EXAMPLE_LABEL': 'Et s\'utilise comme ca',
		    'ADD_POST_FORM_SUBMIT_BTN_LABEL':'Ajouter',
		    'ADD_POST_FORM_CANCEL_BTN_LABEL':'Annuler',
		    'ADD_LABEL':'Ajouter',
		    'ADD_POST_FORM_LEGEND':'Ajouter un mot ou expression',
		    'RESOLVE_POST_FORM_LEGEND':'Résoudre une Requête',
		    'ADD_POST_FORM_WORD_REQUIRED_ERROR':'Tu donnes ca ou c\'est gaté!',
		    'ADD_POST_FORM_DEFINITION_REQUIRED_ERROR':'Ca ment! Tu donnes ca ou c\'est gaté!',
		    'ADD_POST_FORM_EXAMPLE_REQUIRED_ERROR':'Ca a menti! Faut donner example!',
		    'ADD_POST_REQUEST_FORM_LEGEND':'Demander une Traduction',
		    'ADD_POST_REQUEST_FORM_WORD_LABEL':'Mot ou Expression',
		    'ADD_POST_REQUEST_FORM_WORD_REQUIRED_ERROR':'Ca a menti!Tu donnes ça ou c\'est gaté!',
		    'ADD_POST_REQUEST_FORM_TRANSLATION_TYPE_LABEL':'Type de Traduction',
		    'ADD_POST_REQUEST_FORM_TRANSLATION_TYPE_REQUIRED_ERROR':'Tu donnes ça ou c\'est gaté!',
		    'ADD_POST_REQUEST_FORM_SUBMIT_BTN_LABEL':'Soumettre',
		    'ADD_POST_FORM_TRANSLATED_FROM_LABEL':'Traduit du',
		    'FORM_CANCEL_BTN_LABEL':'Faut dammer',
		    'POST_BY':'par',
		    'POST_VIEWS':'dîndîns',
		    'POST_VIEW':'Dîndîn',
		    'POST_PROPS':'gbôhs',
		    'POST_PROPSIT':'Gbôh',
		    'FAVORITES':'Gbôhs',
		    'ANONYMOUS':'Anonyme',
		    'EMAIL_ADDRESS':'Addresse Email ',
		    'PASSWORD':'Mot de Passe',
		    'USERNAME':"Nom d'utilisateur",
		    'BACK':'Retour',
		    'CONFIRM_PASSWORD':'Confirmez votre Mot de Passe',
		    'LOGIN_FORM_SIGNIN': 'Connexion',
		     'LOGIN_FORM_LOGIN_WITH_FACEBOOK': 'Connexion avec Facebook',
		    'LOGIN_FORM_EMAIL_REQUIRED_ERROR': 'Votre addresse email est requise',
		    'LOGIN_FORM_PASSWORD_REQUIRED_ERROR': 'Votre email est requis',
		    'LOGIN_FORM_PASSWORD_MATCH_ERROR': 'Votre mot de passe diffère!',
		    'REGISTRATION_FORM_REGISTER': 'Créer un compte',
		    'ERROR_EMAIL_ALREADY_EXISTS':'Cette addresse email a deja ete enregistrée!',
		    'ERROR_USERNAME_ALREADY_EXISTS':"Ce nom d'utilisateur a deja ete enregistré!",
		    'ERROR_WRONG_CREDENTIALS':'On ne sait pas qui tu es dêh! Faut essayer encore!',
		    'ERROR_SOMETHING_WENT_WRONG':"C'est gaaaté! Ya dra quelque part sur le serveur! Faut essayer encore!",
		    'RESOLVE':'Résoudre',
		    'NOUCHI_TO_FRENCH':'Français au Afrikik',
		    'FRENCH_TO_NOUCHI':'Afrikik au Français'
		    
		  });
	              
	    $translateProvider.preferredLanguage('fr');
	    //Set up environmental configuration
	    var localhostRegex = /local/g
        var currentEnv = localhostRegex.test(window.location.hostname)?"dev":"prod"
        $provide.constant('config',envConfiguration[currentEnv]);
        var requestsInProgress = 0;

      	$httpProvider.interceptors.push(['$rootScope', '$q','config','TokenHandler','ErrorHandler', function($rootScope, $q, appConfig, tokenHandler, errorHandler) {
    		return {
		          'request': function(config) {
		            if(config.url.indexOf(appConfig.api_base_version) > 0)
		            {
		                  if(!config.params)
		                  {
		                    config.params = {}
		                  }
		                  config.params.access_token = tokenHandler.get()
		            }

		            requestsInProgress++;
		            // Show loader
		            $rootScope.$broadcast("loader_show");		           
			            return config || $q.when(config);
			        },

		          'response': function(response) {
		            
		            if ((--requestsInProgress) === 0) {
		                // Hide loader
		                $rootScope.$broadcast("loader_hide");
		            }
		             //Build client side alerts from the returned server side errors
		            if(response.data.error && response.data.error.errors)
		            {
		            	response.data.alerts=errorHandler.getAlerts(response.data.error.errors)
		            }
		            else if(response.data.error && response.data.error.message)
		            {
		              response.data.alerts=errorHandler.getAlert(response.data.error)
		            }     

		            return response || $q.when(response);
		          },
		          'responseError': function(response) {
		            if ( response.status == 401) {
		              var deferred = $q.defer();
		              $rootScope.$broadcast('event:unauthorized');
		               _trackEvent('Authentication', 'Forbidden', 'Redirect to Login', 0)
		              return deferred.promise;
		            };
		            //Build client side alerts from the returned server side errors
		            if(response.data.error && response.data.error.errors)
		            {
		              response.data.alerts=errorHandler.getAlerts(response.data.error.errors)
		            }
		            else if(response.data.error && response.data.error.message)
		            {
		              response.data.alerts=errorHandler.getAlert(response.data.error)
		            }     
		            
		            return $q.reject( response );
		          }
		        };
		  	}]);

    	
    
  	})
  	.constant('apiPrefix', 'api/v1')
  	.run(['config','$rootScope', '$state', '$stateParams','$q','$http', 'TokenHandler','storage','Global','config', function (appConfig, $rootScope, $state, $stateParams, $q,$http, tokenHandler, localStorage, global, config) {
	  	$rootScope.config = appConfig;
      	$rootScope.$state = $state;
      	$rootScope.$stateParams = $stateParams;
      	$rootScope.systemAlerts=[]
      	$rootScope.$on('event:unauthorized', function(angularEvent) {
			tokenHandler.invalidate();
			global.reset();
    		$state.transitionTo('login');  
		});
      	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
      		$rootScope.systemAlerts.push({
      			type:'danger',
      			msg:error.message

      		})
      		console.log(error.stack)
      	 })

      	var user = localStorage.get(config.localStorageUserKey);
	    if(tokenHandler.get() && user)
	    {
	        $http.defaults.headers.common['Authorization'] = "Basic " + tokenHandler.get();
	        global.setUser(user);
	        $state.transitionTo('posts');     
	    }
	    if(window.user && window.token && window.token != "undefined" )
	    {
	    	$http.defaults.headers.common['Authorization'] = "Basic " + window.token;
	        global.setUser(window.user);
	        tokenHandler.set(window.token )
	        $state.transitionTo('posts');   
	        return;  
	    }
	    
        if(!$state.is("login"))
        {
        	 $state.transitionTo('login');
        }
        else
        {
        	$rootSCope.alerts=[
        		{
        			type:'danger',
        			msg:"Wrong username or password combination"
        		}
        	]
        }
	       
	    
       	
      	
}]);
