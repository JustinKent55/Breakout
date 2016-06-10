//------------------------------------------------------------------
//
// This is the paddle function that handles all of the paddle's 
// movement, information, updating, and rendering.
GAME.paddle = (function(graphics, boundry) {
	'use strict';
		
		var MARGIN = 2,
			LARGE_MARGIN = 7,
			paddleX = undefined,
			paddleY = undefined,
			paddleSpeed = undefined;
		
		//Initialize that Game.paddle object
		function initialize(spec) {
			var that = {};
				
			//Move function for changing the paddle's position
			that.moveLeft = function(elapsedTime) {

				if(insideLeftBoundry(spec.center.x - (spec.width/2)) ) {
					if(approachingLeftBoundry(spec.center.x - (spec.width/2)) ) {
						spec.center.x -= spec.speed * MARGIN;
					} else {
						spec.center.x -= spec.speed * elapsedTime;
						paddleX = spec.center.x
					}
				} else {
					//Outside bounds. Do nothing...
				}
			};
			
			that.moveRight = function(elapsedTime) {
				
				if(insideRightBoundry(spec.center.x + (spec.width/2)) ) {
					if(approachingRightBoundry(spec.center.x + (spec.width/2)) ) {
						spec.center.x += spec.speed * MARGIN;
					} else {
						spec.center.x += spec.speed * elapsedTime;
						paddleX = spec.center.x;
					}
				} else {
					//Outside bounds. Do nothing...
				}
			};

			//Render the paddle object
			that.render = function() {
				graphics.drawImage(spec);
			};

			//Report the paddle's specs for troubleshooting
			that.report = function() {
				console.log('Paddle X: ' + spec.center.x);
				console.log('Paddle Y: ' + spec.center.y);
				console.log('Paddle Speed: ' + spec.speed);
			};
			
			that.reset = function() {
				spec.center.x = spec.default.x;
				spec.center.y = spec.default.y;
				spec.width = spec.default.width;
				spec.height = spec.default.height;
				spec.speed = spec.default.speed;
			};
			
//GETTER FUNCTIONS-----------------------------------------------------
			that.getX = function() {
				return spec.center.x;
			};
			
			that.getY = function() {
				return spec.center.y;
			};
			
			that.getSpeed = function() {
				return spec.speed;
			};
			
			that.getWidth = function() {
				return spec.width;
			};
			
			that.getHeight = function() {
				return spec.height;
			};
//---------------------------------------------------------------------
			
			
//SETTER FUNCTIONS-----------------------------------------
			that.setWidth = function(width) {
				spec.width = width;
			};

//---------------------------------------------------------
			return that;
		}
		
		function update(elapsedTime) {
			
		}
		
		//Check to see if the paddle is getting close to
		//the left wall.
		function approachingLeftBoundry (x) {
			if(x < boundry.left + LARGE_MARGIN) {
				return true;
			}
			return false;
		}
		
		//Check to see if the paddle is getting close to
		//the right wall.
		function approachingRightBoundry (x) {
			if (x > boundry.right - LARGE_MARGIN) {
				return true;
			}
			return false;
		}
		
		//Check to make sure the paddle has not moved passed
		//the left wall.
		function insideLeftBoundry(x) {
			if(x < boundry.left + MARGIN) {
				return false;
			}
			return true;
		}
		
		//Check to make sure the paddle has not moved passed
		//the right wall.
		function insideRightBoundry(x) {
			if (x > boundry.right - MARGIN) {
				return false;
			}
			return true;
		}
		
	return {
		initialize: initialize,
		update: update
	};
}(GAME.graphics, GAME.boundry));