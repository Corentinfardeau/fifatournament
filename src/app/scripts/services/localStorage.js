'use strict';

angular.module('fifatournament')

	.service('LocalStorage', function LocalStorage() {
    
    // Allow to set & edit items in local storage
    this.setLocalStorage = function(key,value) {
         localStorage.setItem(key, JSON.stringify(value));
    };
    
    // Allow to get items in local storage
    this.getLocalStorage = function(key) {
        return JSON.parse(localStorage.getItem(key));
    };

  });
