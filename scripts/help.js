//------------------------------------------------------------------
//
// 'help' menu state. Runs from GAME.game.showScreen('help').
GAME.screens['help'] = (function(game) {
	'use strict';
	
	function initialize() {
		document.getElementById('id-help-back').addEventListener(
			'click',
			function() { game.showScreen('main-menu'); });
	}
	
	function run() {
		var myScreen = document.getElementsByClassName('screen');
		
		for(var i = 0; i < myScreen.length; i++) {
			myScreen[i].style.backgroundImage = 'url(./images/otherMenuBackground.png)';
		}
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(GAME.game));
