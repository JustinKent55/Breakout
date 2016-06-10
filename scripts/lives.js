//------------------------------------------------------------------
//
// This is the lives function that handles the game
// paddle's life images in the bottom right corner.
GAME.lives = (function(graphics) {
	'use strict';

		//Initialize the lives object for rendering during gameplay.
		function initialize(spec) {
			var that = {};
			
			//Initialize all the lives drawing coordinates.
			that.generate = function() {
				spec.lives.length = 0;
				
				for(var i = 0; i < GAME.livesRemaining; i++) {
					spec.lives.push( {
						image: spec.image,
						center: {x: spec.starting.x - (i * spec.pitch.x) - (i * spec.width), y: spec.starting.y},
						width: spec.width,
						height: spec.height
					} );
				}
			}
			
			//Render the lives images
			that.render = function() {
				
				for(var i = 0; i < spec.lives.length; i++) {
					graphics.drawImage(spec.lives[i]);
				}
			};
			
			that.removeLife = function() {
				spec.lives.pop();
				GAME.livesRemaining--;
			};
			
			that.update = function() {
				//nothing to do...
			};
			
			that.report = function() {
				//nothing yet...
			};
			
			return that;
		}
	
		return {
		initialize: initialize
	};
}(GAME.graphics));