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
    if (array) {
        return( array.sort(function(a,b){
                    return a.createdAt < b.createdAt
                })
              )
    }else{
        return []
    }
    
    
  };
});

