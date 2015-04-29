'use strict';

angular.module('fifatournament')
	.service('displayMessages', function LocalStorage() {

		this.error = function(msg) {
			this.create('error',msg);
		};

		this.info = function(msg) {
			this.create('info',msg);
		};

		this.success = function(msg) {
			this.create('success',msg);
		};

		this.create = function(type,msg) {
			var elNode = document.getElementsByClassName('container');
			var div = document.createElement('div');

			div.classList.add(type);
			div.classList.add('msg');
			div.innerHTML = msg + '<i class="msg-close fa fa-fw fa-times"></i>';

			elNode[0].appendChild(div);
		};
});
