//-----------------------------------------------------------------------------------
//
// This is the ball object IIFE. It handles everything that the ball needs to know.
// Ball current position, speed, direction.
// How to reflect off of the paddle, walls and bricks.
GAME.ball = (function(graphics, boundry, images) {
	'use strict';
	
	var ballID = 0,
		ballCount = 0,
		Balls = {},
		myPaddle = {},
		myBricks = [],
		ballsToDestroy = [],
		bricksToDestroy = [],
		totalBricksRemoved = 0,
		brickFromTopRowDestroyed = false,
		ballSpeedIncreaseIntervals = [4, 12, 36, 62],
		ballSpeedIncreaseAmount = [2.5, 2.9, 3.2, 3.5],
		ballSpeedIndex = 0,
		NEAR = 5, MEDIUM = 10, FAR = 30, VERY_FAR = 60,
		SLOW_DIRECTION = 0.005, MID_DIRECTION = 0.025, FAST_DIRECTION = 0.055, VERYFAST_DIRECTION = 0.065;
	
	//Initialize that Game.paddle object
	function initialize() {
		var that = {};
		
		that.reset = function() {
			ballID = 0;
			ballCount = 0;
			totalBricksRemoved = 0
			Balls = {};
			myPaddle = {};
			myBricks = [];
			ballsToDestroy = [];
			bricksToDestroy = [];
			brickFromTopRowDestroyed = false;
			ballSpeedIndex = 0;
		}
		
		//Render the paddle object
		that.render = function() {
			for(var items in Balls) {
				graphics.drawImage(Balls[items]);
			}
		};
		
		that.generate = function() {
			Balls[ballID] = {
				imageArray: [images['images/energyBall_01.png'], 
						images['images/energyBall_02.png'], 
						images['images/energyBall_03.png'], 
						images['images/energyBall_04.png']],
				image: images['images/energyBall_01.png'],
				width: 15, height: 15,
				center: {x: 500, y: 530},
				speed: 2.0,
				direction: {x: 0.025, y: -0.1},
				rotation: 0,
				lastKnownGoodCenter: {x: 500, y: 530}
			};
			ballID++;
			ballCount++;
		};
		
		//Update paddle variables
		that.updatePaddle = function(x, y, width, height) {
			myPaddle.x = x;
			myPaddle.y = y;
			myPaddle.width = width;
			myPaddle.height = height;
		};
		
		//Send the paddle's width back to paddle.js
		that.getPaddleWidth = function() {
			return myPaddle.width;
		}
		
		//Update the state of bricks for collision detection
		that.updateBricks = function(bricks) {
			bricksToDestroy.length = 0;
			myBricks = bricks;
		};
		
		// Update function deals with detecting collision with all objects.
		// objects include: Boundry walls, myPaddle and all bricks
		that.update = function(elapsedTime) {
			
			for(var items in Balls) {
				if(hasFallentoDeath(Balls[items].center.y, Balls[items].height) ) {
					ballCount--;
					ballsToDestroy.push(items);
				} else {
					updateBallPosition(elapsedTime, items);
					updateBallImage();
					updateBallSpeed();
				}
			}
			
			//Update any balls that need to be deleted
			if(ballsToDestroy.length != 0) {
				deleteBalls();
				ballSpeedIndex--;
			}
			
			//If the last ball on the screen dies,
			//restart the countdownloop.
			if(ballCount === 0 && GAME.livesRemaining !== 0) {
				GAME.countdownloopRequested = true;
			}
		};
		
		that.getBricksToDestroy = function() {
			return bricksToDestroy;
		}
		
		that.report = function(ID) {
			console.log('Ball X: ' + Balls[ID].center.x);
			console.log('Ball Y: ' + Balls[ID].center.y);
			console.log('Ball X Direction: ' + Balls[ID].direction.x);
			console.log('Ball Y Direction: ' + Balls[ID].direction.y);
			console.log('Ball Image: ' + Balls[ID].image);
		};
		
		return that;
	};
	
//BALL POSITION/DELETION HANDLING------------------------------------------------------

	//This function will rotate which ball image to use.
	//It will also rotate the ball's angles.
	function updateBallImage() {
		for(var items in Balls) {
			Balls[items].image = Balls[items].imageArray[Random.nextRange(0,3)];
			//Balls[items].rotation = Random.nextRange(0,360);
		}
	}

	//If the ball has not died, update its position
	function updateBallPosition(elapsedTime, ID) {
		
		//Update ball location
		Balls[ID].center.x += Balls[ID].direction.x *  Balls[ID].speed * elapsedTime;
		Balls[ID].center.y += Balls[ID].direction.y * Balls[ID].speed * elapsedTime;
		
		if(hasCollidedWithLeftWall(Balls[ID].center.x, Balls[ID].width) ) {
			//console.log("Collision with left wall..");
			Balls[ID].center.x = Balls[ID].lastKnownGoodCenter.x;
			Balls[ID].center.y = Balls[ID].lastKnownGoodCenter.y;
			
			Balls[ID].direction.x *= -1;
		}
		
		if(hasCollidedWithRightWall(Balls[ID].center.x, Balls[ID].width) ) {
			//console.log("Collision with right wall..");
			Balls[ID].center.x = Balls[ID].lastKnownGoodCenter.x;
			Balls[ID].center.y = Balls[ID].lastKnownGoodCenter.y;
			
			Balls[ID].direction.x *= -1;
		}
		
		if(hasCollidedWithUpperWall(Balls[ID].center.y, Balls[ID].height) ) {
			//console.log("Collision with upper wall..");
			Balls[ID].center.x = Balls[ID].lastKnownGoodCenter.x;
			Balls[ID].center.y = Balls[ID].lastKnownGoodCenter.y;
			
			Balls[ID].direction.y *= -1;
		}
		
		//Has there been a collision with the paddle?
		if(hasCollidedWithPaddle(Balls[ID].center.x, Balls[ID].center.y, Balls[ID].width, Balls[ID].height) ) {
			var distance = undefined,
				invertX = false,
				invertY = false;
			
			//console.log("Collision with paddle..");
			
			//What is the distance from paddle center to ball center?
			//Positive = Ball is right of paddle.
			//Negative = Ball is left of paddle.
			distance = distanceFromBallCenterToPaddleCenter(Balls[ID].center.x);
			
			//Handle movement if ball is very close to center X-coord of paddle
			//Determine if ball is moving left or right.
			if( Math.abs(distance) <= NEAR ) {
				distanceAndDirectionCheck(distance, SLOW_DIRECTION, ID);
			} else if( Math.abs(distance) <= MEDIUM ) {
				distanceAndDirectionCheck(distance, MID_DIRECTION, ID);
			} else if( Math.abs(distance) <= FAR ) {
				distanceAndDirectionCheck(distance, FAST_DIRECTION, ID);
			} else if( Math.abs(distance) <= VERY_FAR ) {
				distanceAndDirectionCheck(distance, VERYFAST_DIRECTION, ID);
			}
			
			//Ensure ball is moving up when paddle hits it.
			if(Balls[ID].direction.y > 0) {
				Balls[ID].direction.y *= -1;
			}
		}
		
		
		//Has there been a collision with any bricks?
		for(var b = 0; b < myBricks.length; b++) {
			if(myBricks[b].alive === true) {	//is the brick still alive?
				if(hasCollidedWithBrick(Balls[ID].center.x, Balls[ID].center.y, Balls[ID].width, Balls[ID].height, b) ) {
					bricksToDestroy.push( { cell: {x: myBricks[b].cell.x , y: myBricks[b].cell.y } } );
					totalBricksRemoved++;
					invertY = true;
					
					//If a top row brick has not already been destroyed
					//Check if the current brick destroyed was from the top row
					//The way the bricks are being generated in bricks.js, 
					//the cell.y will always be 0 for the top row.
					if(!brickFromTopRowDestroyed) {
						if(myBricks[b].cell.y === 0) {
							brickFromTopRowDestroyed = true;
							myPaddle.width /= 2;
						}
					}
				}
			}
		}
		
		if(invertY) {
			Balls[ID].direction.y *= -1;
		}
		
		//Make sure to update the last known good x and y locations for the ball.
		Balls[ID].lastKnownGoodCenter.x = Balls[ID].center.x;
		Balls[ID].lastKnownGoodCenter.y = Balls[ID].center.y;
	} //END OF updateBallPosition()
	
	
	//Check distance from object "like myPaddle" and see which direction
	//it is coming from. Update with a new direction as needed.
	function distanceAndDirectionCheck(distance, newDirection, ID) {
		if( distance > 0 && Balls[ID].direction.x > 0 ) {
			Balls[ID].direction.x = newDirection;
			//no need to invert X
		} else if ( distance > 0 && Balls[ID].direction.x < 0 ) {
			Balls[ID].direction.x = (newDirection * -1);
			Balls[ID].direction.x *= -1;
		} else if ( distance <= 0 && Balls[ID].direction.x > 0 ) {
			Balls[ID].direction.x = newDirection;
			Balls[ID].direction.x *= -1;
		} else if ( distance <= 0 && Balls[ID].direction.x < 0 ) {
			Balls[ID].direction.x = (newDirection * -1);
			//no need to invert X
		}
	}
	
	//Update the speed of the balls based on how
	//many bricks have been destroyed.
	function updateBallSpeed() {
		if(totalBricksRemoved >= ballSpeedIncreaseIntervals[ballSpeedIndex]) {
			for(var items in Balls) {
				Balls[items].speed = ballSpeedIncreaseAmount[ballSpeedIndex];
			}
			
			ballSpeedIndex++;
		}
	}
	
	//Delete all balls that have fallen off the screen
	function deleteBalls() {
		for(var i = 0; i < ballsToDestroy.length; i++) {
			delete Balls[ballsToDestroy[i]];
		}
		
		ballsToDestroy.length = 0;
	}
	
//--------------------------------------------------------------------------------


//WALL COLLISION DETECTION----------------------------------------
	function hasCollidedWithLeftWall(x, width) {
		return !( (x - width/2) > boundry.left );
	}
	
	function hasCollidedWithRightWall(x, width) {
		return !( (x + width/2) < boundry.right );
	}
	
	function hasCollidedWithUpperWall(y, height) {
		return !( (y - height/2) > boundry.upper );
	}
	
	function hasFallentoDeath(y, height) {
		return !( (y - height/2) < boundry.lower );
	}
//----------------------------------------------------------------


//PADDLE COLLISION DETECTION----------------------------------------------------
	function hasCollidedWithPaddle(x, y, width, height) {
		return !( (y + height/2) < (myPaddle.y - myPaddle.height/2) ||		//ball.bottom < myPaddle.top
				  (y - height/2) > (myPaddle.y + myPaddle.height/2) ||		//ball.top > myPaddle.bottom
				  (x - width/2) > (myPaddle.x + myPaddle.width/2) ||		//ball.left > myPaddle.right
				  (x + width/2) < (myPaddle.x - myPaddle.width/2) );		//ball.right < myPaddle.left
	}
	
	function isBallatEdgeofPaddle(x, width, distance) {
		
		if( distance < 0 ) {		//is ball left of paddle?
			if( (x + width/2) - (myPaddle.x - myPaddle.width/2) <= NEAR ) {
				return true;
			}
		} else if ( distance > 0 ) {	//is ball right of paddle?
			if( (x - width/2) - (myPaddle.x + myPaddle.width/2) <= NEAR ) {
				return true;
			}
		} else {
			return false;
		}
	}
	
	function isBallBelowPaddleCenter(y) {
		if(y > myPaddle.y) {
			return true;
		} else {
			return false;
		}
	}
	
	//Positive = Ball is right of paddle.
	//Negative = Ball is left of paddle.
	function distanceFromBallCenterToPaddleCenter(x) {
		return x - myPaddle.x;
	}
//-------------------------------------------------------------------------------


//BRICK COLLISION DETECTION--------------------------------------
	function hasCollidedWithBrick(x, y, width, height, num) {
		return !( (y + height/2) < (myBricks[num].center.y - myBricks[num].height/2) ||		//ball.bottom < myBricks.top
				  (y - height/2) > (myBricks[num].center.y + myBricks[num].height/2) ||		//ball.top > myBricks.bottom
				  (x - width/2) > (myBricks[num].center.x + myBricks[num].width/2) ||		//ball.left > myBricks.right
				  (x + width/2) < (myBricks[num].center.x - myBricks[num].width/2) );		//ball.right < myBricks.left
	}
	
//----------------------------------------------------------------

	return {
		initialize: initialize,
	}
	
}(GAME.graphics, GAME.boundry, GAME.images));