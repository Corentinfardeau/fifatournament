'use strict';

angular.module('fifatournament')
	.controller('NewCtrl', function ($scope) {
		// A TOUT BIEN ORGANISÉ TOUT ÇA
		var players = 1;
		var p_by_t = 1;

		var players_less = document.getElementById('players_less');
		var players_nb = document.getElementById('players_nb');
		var players_more = document.getElementById('players_more');

		var team_less = document.getElementById('team_less');
		var team_nb = document.getElementById('team_nb');
		var team_more = document.getElementById('team_more');

		players_less.addEventListener('click',function(){
			players--;
			if(players == 0) players = 1;
			if(p_by_t > players) {
				p_by_t = players;
				team_nb.innerHTML = p_by_t;
			}
			players_nb.innerHTML = players;
		},false);
		players_more.addEventListener('click',function(){
			players++;
			if(players > 14) players = 14;
			players_nb.innerHTML = players;
		},false);

		team_less.addEventListener('click',function(){
			p_by_t--;
			if(p_by_t == 0) p_by_t = 1;
			team_nb.innerHTML = p_by_t;
		},false);
		team_more.addEventListener('click',function(){
			p_by_t++;
			if(p_by_t > players) p_by_t = players;
			team_nb.innerHTML = p_by_t;
		},false);

		var random_txt = document.getElementById('random_txt');
		var random_box = document.getElementById('random_box');

		random_txt.addEventListener('click',function(){
			random_box.click();
		},false);
		random_box.addEventListener('click',function(){
			var inputs = document.getElementsByClassName('players_name');
			console.log(inputs);
			for(var j = 0, l = inputs.length; j < l; j++) {
				console.log(inputs[j]);
				document.getElementById('wrapper_inputs_name').innerHTML = '';
			}

			if(this.checked) {
				for(var i = 0, l = players; i < l; i++) {
					var input = document.createElement('input');

					input.classList.add('players_name');
					input.setAttribute('placeholder','Joueur ' + (i + 1));
					input.setAttribute('required','true');

					document.getElementById('wrapper_inputs_name').appendChild(input);
				}
			}
		},false);
	});
