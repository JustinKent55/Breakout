//------------------------------------------------------------------
//
// This is the GAME object that handles all game parameters and functions.
// Game images are stored. 
// The gameloop is executed upon IEFE call from the GAME.screen['game-play']
// run() when the user selects New Game from the main menu.
var GAME = {
	lastTimeStamp: performance.now(),
	elapsedTime: 0,
	won: false,
	highScores: {},
	newHighScoreKey: undefined,
	myScore: undefined,
	myScoreText: undefined,
	myNewText: undefined,
	myHighScoreText: undefined,
	newBallIndex: 0,
	newBallInterval: undefined,
	newBallAtScoreArray: [],
	myLives: undefined,
	livesRemaining: undefined,
	countdownTime: undefined,
	countdownText: undefined,
	gameOverText: undefined,
	countdownloopRequested: false,
	cancelNextRequest: undefined,
	myKeyboard: undefined,
	myPaddle: undefined,
	myBricks: undefined,
	myBall: undefined,
	myParticles: undefined,
	boundry: {
		left: undefined,
		right: undefined,
		upper: undefined,
		lower: undefined
	},

	screens: {},

	images: {},

	status: {
		preloadRequest : 0,
		preloadComplete : 0
	},
	
	//----------------------------------------------------
	// 
	// Allow the game menu to reinitialize some values.
	reinitialize: function () {
		GAME.lastTimeStamp = performance.now();
		GAME.cancelNextRequest = false;
		GAME.myScore = 0;
		GAME.livesRemaining = 3;
		GAME.countdownTime = 3000;
		GAME.myPaddle.reset();
		GAME.myBricks.generate();
		GAME.myBall.reset();
		GAME.myLives.generate();
		GAME.myScore = 0;
		GAME.myBricks.resetScore();
		GAME.myParticles.reset();
		GAME.myScoreText.toDefault();
		GAME.myScoreText.update('Score: '+ GAME.myScore);
		
		do {
			if(GAME.newBallAtScoreArray.length === 0) {
				GAME.newBallAtScoreArray.push(GAME.newBallInterval);
			} else {
				GAME.newBallAtScoreArray.push( GAME.newBallAtScoreArray[GAME.newBallAtScoreArray.length-1] + GAME.newBallInterval);
			}
			
		} while(GAME.newBallAtScoreArray[GAME.newBallAtScoreArray.length-1] < GAME.myBricks.getHighestScorePossible() );
		
		//Start with a new ball
		GAME.myBall.generate();
	},
	
	//----------------------------------------------------
	// 
	// This is the main gameloop render function.
	// Render all objects that need rendering.
	render: function() {
		GAME.graphics.drawImage(GAME.background);
		GAME.myScoreText.render();
		GAME.myLives.render();
		GAME.myBall.render();
		GAME.myPaddle.render();
		GAME.myBricks.render();
		GAME.myParticles.render();
	},
	
	//----------------------------------------------------
	// 
	// This is the main gameloop update function.
	// Update all objects that need updating.
	update: function(elapsedTime) {
		var i,
			divide = 4;

		//update more interations for objects where
		//collision detection is critical
		for(i = 0; i < divide; i++) {
			GAME.myKeyboard.update(elapsedTime/divide);
			GAME.myBall.updatePaddle(GAME.myPaddle.getX(), 
								GAME.myPaddle.getY(),
								GAME.myPaddle.getWidth(), 
								GAME.myPaddle.getHeight());
								
			GAME.myBall.updateBricks(GAME.myBricks.getBricks());
			GAME.myBall.update(elapsedTime/divide);
			GAME.myPaddle.setWidth( GAME.myBall.getPaddleWidth() );
			GAME.won = GAME.myBricks.update( GAME.myBall.getBricksToDestroy() );
			GAME.myParticles.update(elapsedTime/divide);
		}
		
		GAME.myScore = GAME.myBricks.getScore();
		
		//Every 100 points, generate a new ball.
		if(GAME.myScore >= GAME.newBallAtScoreArray[GAME.newBallIndex]) {
			GAME.myBall.generate();
			GAME.newBallIndex++;
		} 
		
		GAME.myScoreText.update('Score: '+ GAME.myScore);
	},
	
	//----------------------------------------------------
	// 
	// This is the main gameloop function.
	// calculate the elapsedTime since last frame, call update(), render()
	gameloop: function(time) {
		GAME.elapsedTime = time - GAME.lastTimeStamp;
		GAME.lastTimeStamp = time;
		
		GAME.update(GAME.elapsedTime);
		GAME.render();
		
		if(GAME.countdownloopRequested) {
			GAME.myLives.removeLife();
			
			if(GAME.livesRemaining === 0){
				GAME.checkScores();
				GAME.gameOverText.render();	//Game Over State
			} else {
				GAME.myBall.generate();	//This needs to stay here so the countdownloop can render that it exists.
				requestAnimationFrame(GAME.countdownloop);
			}
		} else if(GAME.won) {
			GAME.checkScores();			//Game Won State
		} else if(!GAME.cancelNextRequest) {
			requestAnimationFrame(GAME.gameloop);
		}
	},
	
	//----------------------------------------------------
	// 
	// This is the countdownloop function.
	// count down from '3' to '1' before starting the gameloop.
	// This function will also be called if there are no balls left
	// AND paddle lives are remaining.
	countdownloop: function(time) {
		GAME.elapsedTime = time - GAME.lastTimeStamp;
		GAME.lastTimeStamp = time;
		GAME.countdownTime -= GAME.elapsedTime;
		
		//Need to check if the countdownloop needs to continue
		//in case the user hit the "Back" button during gameplay.
		if(!GAME.cancelNextRequest) {
			if(GAME.countdownTime <= 0) {
				GAME.countdownloopRequested = false;
				GAME.countdownTime = 3000;
				requestAnimationFrame(GAME.gameloop);
			} else {
				GAME.myKeyboard.update(GAME.elapsedTime);
				GAME.myParticles.update(GAME.elapsedTime);
				GAME.render(GAME.elapsedTime);
				GAME.countdownText.update(Math.trunc(( GAME.countdownTime/1000) + 1 ) );
				GAME.countdownText.render();
				requestAnimationFrame(GAME.countdownloop);
			}
		}
	},
	
	//----------------------------------------------------
	// 
	// Manage scores for a player that wins.
	// Check if score is a new high score that needs to persist.
	checkScores: function() {
		GAME.graphics.drawImage(GAME.background);
		
		if( GAME.persistence.isANewHighScore(GAME.myScore) ) {
			GAME.myNewText.render();
			GAME.myHighScoreText.render();
			GAME.myScoreText.update(GAME.myScore);
			GAME.myScoreText.setPosition(725,190);
			GAME.myScoreText.setFont('125px Arial, sans-serif');
			GAME.myScoreText.render();
		} else {
			GAME.myScoreText.update('Score: ' + GAME.myScore);
			GAME.myScoreText.setPosition(185,190);
			GAME.myScoreText.setFont('125px Arial, sans-serif');
			GAME.myScoreText.render();
		}
	}
};

//------------------------------------------------------------------
//
// This is the GAME.game IIFE that handles all menu functions.
// Menu states are initialized and shown through here.
// Called from the IIFE return statement in GAME.initialization.
GAME.game = (function(screens) {
	'use strict';
	
	function showScreen(id) {
		var screen = 0,
			active = null;
		
		// Remove the active state from all screens.  There should only be one...
		active = document.getElementsByClassName('active');
		for (screen = 0; screen < active.length; screen++) {
			active[screen].classList.remove('active');
		}
		
		// Tell the screen to start actively running
		screens[id].run();
		
		// Then, set the new screen to be active
		document.getElementById(id).classList.add('active');
	}
	
	//------------------------------------------------------------------
	//
	// This function performs the one-time game initialization.
	function initialize() {
		var screen = null;
		
		// Go through each of the screens and tell them to initialize
		for (screen in screens) {
			if (screens.hasOwnProperty(screen)) {
				screens[screen].initialize();
			}
		}
		
		// Make the main-menu screen the active one
		showScreen('main-menu');
	}
	
	return {
		initialize: initialize,
		showScreen: showScreen
	};

}(GAME.screens));

//------------------------------------------------------------------
//
// Wait until the browser 'onload' is called before starting to load
// any external resources.  This is needed because a lot of JS code
// will want to refer to the HTML document.
//
//------------------------------------------------------------------
window.addEventListener('load', function() {
	console.log('Loading resources...');
	Modernizr.load([
		{
			load : [
				'preload!images/starBlue.png',
				'preload!images/greenBrick.png',
				'preload!images/blueBrick.png',
				'preload!images/orangeBrick.png',
				'preload!images/yellowBrick.png',
				'preload!images/energyBall_01.png',
				'preload!images/energyBall_02.png',
				'preload!images/energyBall_03.png',
				'preload!images/energyBall_04.png',
				'preload!images/paddle.png',
				'preload!images/gameBackground.png',
				'preload!images/mainMenuBackground.png',
				'preload!images/otherMenuBackground.png',
				'preload!scripts/random.js',
				'preload!scripts/scorePersistance.js',
				'preload!scripts/mainMenu.js',
				'preload!scripts/game-play.js',
				'preload!scripts/help.js',
				'preload!scripts/about.js',
				'preload!scripts/highScores.js',
				'preload!scripts/keyboardInput.js',
				'preload!scripts/graphics.js',
				'preload!scripts/particleSystem.js',
				'preload!scripts/text.js',
				'preload!scripts/lives.js',
				'preload!scripts/paddle.js',
				'preload!scripts/bricks.js',
				'preload!scripts/ball.js',
				'preload!scripts/Initialize.js'
			],
			complete : function() {
				console.log('All files requested for loading...');
			}
		}
	]);
}, false);

//
// Extend yepnope with our own 'preload' prefix that...
// * Tracks how many have been requested to load
// * Tracks how many have been loaded
// * Places images into the 'images' object
yepnope.addPrefix('preload', function(resource) {
	console.log('preloading: ' + resource.url);
	
	GAME.status.preloadRequest += 1;
	var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
	resource.noexec = isImage;
	resource.autoCallback = function(e) {
		if (isImage) {
			var image = new Image();
			image.src = resource.url;
			GAME.images[resource.url] = image;
		}
		GAME.status.preloadComplete += 1;
		
		//
		// When everything has finished preloading, go ahead and start the game
		if (GAME.status.preloadComplete === GAME.status.preloadRequest) {
			console.log('Preloading complete!');
			GAME.initialize();
		}
	};
	
	return resource;
});
