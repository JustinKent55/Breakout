//------------------------------------------------------------------
//
// 'main-menu' menu state. Runs from GAME.game.showScreen('main-menu').
// This menu allows the user to access all other menu states.
GAME.screens['main-menu'] = (function(game) {
	'use strict';
	
	function initialize() {
		//
		// Setup each of menu events for the screens
		document.getElementById('id-new-game').addEventListener(
			'click',
			function() {game.showScreen('game-play'); });
		
		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() { game.showScreen('high-scores'); });
		
		document.getElementById('id-help').addEventListener(
			'click',
			function() { game.showScreen('help'); });
		
		document.getElementById('id-about').addEventListener(
			'click',
			function() { game.showScreen('about'); });
	}
	
	function run() {
		var myScreen = document.getElementsByClassName('screen');
		
		for(var i = 0; i < myScreen.length; i++) {
			myScreen[i].style.backgroundImage = 'url(./images/mainMenuBackground.png)';
		}
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(GAME.game));