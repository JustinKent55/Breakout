GAME.bricks = (function(graphics) {
	'use strict';
	
	var ROWS = 8,
		COLUMNS = 14,
		GREEN = 5, BLUE = 3,
		ORANGE = 2, YELLOW = 1,
		score = 0,
		rowDestroyed = [],
		ROWDESTROYEDPOINTS = 25,
		highestScorePossible = 0;
	
	//Initialize that Game.paddle object
	function initialize(spec) {
		var that = {};
		
		that.generate = function() {
			//If the spec's brick array is not empty, clear it out.
			spec.bricks.length = 0;
			
			//Initialize all brick cell coordinates, x & y locations, images
			for(var i = 0; i < COLUMNS; i++) {
				for(var j = 0; j < ROWS; j++) {
					spec.bricks.push ( {
						cell: { x: i, y: j }, 
						center: {x: (((i * spec.width) + spec.starting.x + (i * spec.pitch.x)) + spec.width/2), y: (((j * spec.height) + spec.starting.y + (j * spec.pitch.y)) + spec.height/2)},
						width: spec.width,
						height: spec.height,
						image: undefined,
						alive: true
					} );
					
					if(j < 2) {
						spec.bricks[spec.bricks.length-1].image = spec.topImage;	//green brick
						spec.bricks[spec.bricks.length-1].worthPoints = GREEN;		//is worth GREEN point value
						highestScorePossible += GREEN;
					} else if(j >= 2 && j < 4) {
						spec.bricks[spec.bricks.length-1].image = spec.upperimage;	//blue brick
						spec.bricks[spec.bricks.length-1].worthPoints = BLUE;		//is worth BLUE point value
						highestScorePossible += BLUE;
					} else if(j >= 4 && j < 6) {
						spec.bricks[spec.bricks.length-1].image = spec.lowerImage; 	//orange brick
						spec.bricks[spec.bricks.length-1].worthPoints = ORANGE;		//is worth ORANGE point value
						highestScorePossible += ORANGE;
					} else if(j >= 6) {
						spec.bricks[spec.bricks.length-1].image = spec.bottomImage;	//yellow brick
						spec.bricks[spec.bricks.length-1].worthPoints = YELLOW;		//is worth YELLOW point value
						highestScorePossible += YELLOW;
					}
				}
			}
			
			//Initialize that none of the rows have
			//been completely destroyed
			for(var i = 0; i < ROWS; i++) {
				rowDestroyed.push(false);
				highestScorePossible += ROWDESTROYEDPOINTS;
			}
		};
		
		that.render = function() {
			for(var i = 0; i < spec.bricks.length; i++) {
				if(spec.bricks[i].alive === true) {
					graphics.drawImage(spec.bricks[i]);
				}
			}
		};
		
		//Update which bricks have been destroyed by the ball
		that.update = function( bricksToBeDestroyed ) {
			for(var i = 0; i < bricksToBeDestroyed.length; i++) {
				for(var j = 0; j < spec.bricks.length; j++) {
					if(bricksToBeDestroyed[i].cell.x === spec.bricks[j].cell.x && 
						bricksToBeDestroyed[i].cell.y === spec.bricks[j].cell.y) {
							spec.bricks[j].alive = false;
							score += spec.bricks[j].worthPoints;
							createParticles(spec.bricks[j].center.x,spec.bricks[j].center.y,
											spec.bricks[j].width, spec.bricks[j].height);
							break;
					}
				}
			}
			
			//Check to see if an entire row has been destroyed.
			//Worth 25 points.
			for(var i = 0; i < ROWS; i++) {
				that.isRowDestroyed(i);
			}
			
			//Make all bricks not alive
			//**For code testing purpose only.
			//for(var k = 0; k < spec.bricks.length; k++) {
			//	spec.bricks[k].alive = false;
			//}
			
			//Has the player won?
			return that.hasPlayerWon();
		};
		
		//The spec.bricks array is basically a one-dimentional array
		//that was built with the column perspective.
		//Calculate the correct index using (currentCol * ROWS) + (currentRow % ROWS);
		that.isRowDestroyed = function(row) {
			var count = 0;
			
			if(!rowDestroyed[row]) {
				for(var j = 0; j < COLUMNS; j++) {
					
					if(spec.bricks[ (j * ROWS) + (row % ROWS) ].alive) {
						break;
					} else {
						count++;
					}
				}
				
				if(count === COLUMNS) {
					//console.log('Row # :' + row + ' has been destroyed. +25 points.');
					rowDestroyed[row] = true;
					score += ROWDESTROYEDPOINTS;
				}
			}
		};
		
		that.hasPlayerWon = function() {
			for(var i = 0; i < spec.bricks.length; i++) {
				if(spec.bricks[i].alive) {
					return false;
				}
			}
			
			return true;
		}

//GETTER FUNCTIONS-----------------------------------------------------
		that.getBricks = function() {
			return spec.bricks;
		};
		
		that.getRows = function() {
			return ROWS;
		};
		
		that.getCols = function() {
			return COLUMNS;
		};
		
		that.getScore = function() {
			return score;
		};
		
		that.getHighestScorePossible = function() {
			return highestScorePossible;
		}
//---------------------------------------------------------------------


//SETTER FUNCTIONS------------------------------------------
		that.resetScore = function() {
			score = 0;
		}

//----------------------------------------------------------

		that.report = function () {
			
		};

		return that;
	}
	
	function createParticles(centerX, centerY, width, height) {
		
		//Randomzie the Y location for the where the particles
		//generate inside the brick
		for(var j = 1; j < 10; j++) {
			var topY = centerY - (height/2) + j,
				bottomY = centerY + (height/2) - j; 
			
			for(var i = 0; i < 5; i++) {
				GAME.myParticles.create(Random.nextRange(centerX-(width/2), centerX+(width/2)), topY);
				GAME.myParticles.create(Random.nextRange(centerX-(width/2), centerX+(width/2)), bottomY);
			}
		}
		
	}
	
	return {
		initialize: initialize,
	}
		
}(GAME.graphics));