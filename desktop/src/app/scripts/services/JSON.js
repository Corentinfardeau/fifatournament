'use strict';

angular.module('fifatournament')

.service('JSON',function JSON($http) {
        
        // Read the JSON
        this.get = function(url){
            
           return $http.get(url);

        };
        
        // Read the JSON
        this.post = function(url, params){
            
           return $http.post(url, params);

        };
    
});