'use strict';

angular.module('Afrikik')
  	.service('ErrorHandler', ['envConfiguration', function( config) {
  		
  		var errorHandlerService = {
  			getAlerts:function(errors){
          var errorList=[];
          if(angular.isArray(errors) ||angular.isObject(errors) )
          {
              angular.forEach(errors, function(error, errorKey){
                console.log("Error %s, ErrorKey: %s", error, errorKey)
                if(errorKey == "message")
                {
                   errorList.push({msg:error,type:'danger'})
                }
                else
                {
                   errorList.push({msg:error.message,type:'danger'})
                }
                
              });
          }
          else
          {
            errorList.push({msg:errors.message,type:'danger'})          
          }
          console.dir(errorList)
          return errorList;
  			},
        getAlert:function(error){
          var errorList=[];
              
          errorList.push({msg:error.message,type:'danger'})          
          
          return errorList;
        },
  			
       
  		}
  		return errorHandlerService;

    	
}]);