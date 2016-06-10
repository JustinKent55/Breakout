/*jslint browser: true, white: true, plusplus: true */
/*global MyGame */
GAME.screens['high-scores'] = (function(game, persist) {
	'use strict';
	
	function initialize() {
		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function() { game.showScreen('main-menu'); });
			
			document.getElementById('id-high-scores-delete').addEventListener(
			'click',
			function() { persist.deleteAll(); 
						 game.showScreen('high-scores'); });
	}
	
	function run() {
		var myScreen = document.getElementsByClassName('screen');
		
		for(var i = 0; i < myScreen.length; i++) {
			myScreen[i].style.backgroundImage = 'url(./images/otherMenuBackground.png)';
		}
		
		persist.report();
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(GAME.game, GAME.persistence));