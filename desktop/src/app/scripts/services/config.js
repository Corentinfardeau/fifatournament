'use strict';

angular.module('fifatournament')
.factory('Config',function () {
        
        return {
			API_URL : 'http://localhost:8080/api/',
            //APP_URL : '',
			API_KEY : 'mysupersecretkey',
			//NODE_SERVER : '',
        };
    
});