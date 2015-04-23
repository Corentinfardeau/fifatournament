'use strict';

angular.module('fifatournament')

.service('JSON',function JSON($http) {
        
        // Read the JSON
        this.get = function(url){
            
           return $http.get(url);

        };
    
});