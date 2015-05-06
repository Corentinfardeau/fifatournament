'use strict';

angular.module('fifatournament')
.factory('Config',function () {
        
        return {
			API_URL : 'http://localhost:8080/api/',
            //APP_URL : 'http://plevaillant.local:3000',
			//API_KEY : '',
			//NODE_SERVER : '',
        };
    
});