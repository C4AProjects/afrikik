'use strict';

/* Filters */
Afrikik.filter('capitalize', function() {
    return function(input, scope) {
        if (input!=null)
            return input.substring(0,1).toUpperCase()+input.substring(1);
    }
})
.filter('sortArray', function() {
    
  return function(array) {
    if (array && array.length>10) { //an issue with array length greater than 10 elements
        return array;
    }
    if (array) {
        return( array.sort(function(a,b){
                    return a.createdAt < b.createdAt
                })
              )
    }else{
        return []
    }
    
    
  };
})
.filter('filterOnServer', function(PlayerService, TeamService) {
    
  return function(array) {
    if (array && array.length!=0) { //an issue with array length greater than 10 elements
        return array;
    }else {
        PlayerService.itemsByName(name, function(values){
                                return values;                               
                        })||TeamService.itemsByName(name, function(values){
                                return values;                               
                        })
    }
  }
});

