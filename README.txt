-----------------------------------------------------------------------------------------
				     Breakout
-----------------------------------------------------------------------------------------

Last Release: 10 June 2016
Latest version: 1.0
Developer: Justin Kent

-----------------------------------------------------------------------------------------
                                       About
-----------------------------------------------------------------------------------------
Castle Defense is an HTML Canvas rendered game built using Javascript to control all
of the game's logic. The gameplay is similar to the old Atari Breakout game.

-----------------------------------------------------------------------------------------
                                    Requirements
-----------------------------------------------------------------------------------------
Any web browser that can run Javascript.
Tested on Chrome version 50.0

-----------------------------------------------------------------------------------------
                                  Running the Game
-----------------------------------------------------------------------------------------
This game can also be launched by opening index.html in a browser that meets the 
requirements listed above.

-----------------------------------------------------------------------------------------
                                     Gameplay
-----------------------------------------------------------------------------------------
Keyboard left and right arrow keys control the user's paddle movement.
Keep the ball above the bottom of the canvas to avoid losing lives.
Player has 3 lives total.
Scores can be checked in the main menu > high scores.
Currently, there is only one level.

-----------------------------------------------------------------------------------------
									 Game Art 
-----------------------------------------------------------------------------------------
All game art was created by Justin Kent using GIMP 2.8

Menu art created using GimpTOOTS tutorial "How to make shattered text in Gimp 2.8.10".
https://www.youtube.com/watch?v=ohQ5fY7-yLI

-----------------------------------------------------------------------------------------
                      Some of the Algorithms Used for Game Logic
-----------------------------------------------------------------------------------------
Square object to square object collision detection. This function uses a slightly
more efficient OR style of detection instead of using all AND conditions in the
if statement.
(See scripts/ball.js, using -> function hasCollidedWithBrick(...))

The game's bricks are generated as a javascript 1-dimensional array; however, they are
treated as a 2-dimentional array when checking for collisions or other scans.
Bricks were generated in COLUMN MAJOR. Starting from the top left corner and moving
down to the bottom right.
(See scripts/bricks.js, using -> that.generate = function())

-----------------------------------------------------------------------------------------
                            Future Algorithm Development
-----------------------------------------------------------------------------------------
Note: The collision detection is currently using brute force by checking the ball against
all bricks to see if there was a collision. This was developed intentinally to see if there
are performance issues. So far I have had no performance issues for collision detection.

Note: Since the origin(x,y), pitch(x,y), width and height of all objects in the game are
already known, there is really no need to perform collision detection. 
The position of the bricks and ball are always known. This would be a huge performance 
improvement to change the style of checking for collisions.

-----------------------------------------------------------------------------------------
                                Game Particle System
-----------------------------------------------------------------------------------------
Check out the scripts/particleSystem.js for how particles are created, managed, and 
rendered in the game.
