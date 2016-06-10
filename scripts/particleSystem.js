/*jslint browser: true, white: true, plusplus: true */
/*global Random */
GAME.particleSystem = (function(graphics) {
	'use strict';
	var nextName = 1,	// unique identifier for the next particle
		particles = {};	// Set of all active particles


	function initialize(spec) {
		var that = {};
	
		//------------------------------------------------------------------
		//
		// This creates one new particle
		that.create = function(newX,newY) {
			var p = {
					image: spec.image,
					width: Random.nextGaussian(5,1),
					height: Random.nextGaussian(5,1),
					center: {x: newX, y: newY},
					direction: {x: 0, y: 0.5},
					speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
					rotation: Random.nextRange(0, 360),
					lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// How long the particle should live, in seconds
					alive: 0,	// How long the particle has been alive, in seconds
				};
			
			
			// Ensure we have a valid size, speed, lifetime - gaussian numbers can be negative
			p.width = Math.max(13, p.width);
			p.height = Math.max(5, p.height);
			p.speed = Math.max(10, p.speed);
			p.lifetime = Math.max(0.5, p.lifetime);
			p.activeTime = Math.max(0.05, p.activeTime);
			
			// Assign a unique name to each particle
			particles[nextName++] = p;
		};
		
		//------------------------------------------------------------------
		//
		// Update the state of all particles.  This includes remove any that 
		// have exceeded their lifetime.
		that.update = function(elapsedTime) {
			var removeMe = [],
				value,
				particle;
				
			// We work with time in seconds, elapsedTime comes in as milliseconds
			elapsedTime = elapsedTime / 1000;
			
			for (value in particles) {
				
				if (particles.hasOwnProperty(value)) {
					particle = particles[value];
					
					// Update how long it has been alive
					particle.alive += elapsedTime;
					particle.active += elapsedTime;
					
					
					// Update its position
					particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
					particle.center.y += (elapsedTime * particle.speed * particle.direction.y);
					
					
					// Rotation will be random at every update.
					particle.rotation = Random.nextRange(0, 360);
					
					// If the lifetime has expired, identify it for removal
					if (particle.alive > particle.lifetime) {
						removeMe.push(value);
					}
				}
			}
			
			
			// Remove all of the expired particles
			for (particle = 0; particle < removeMe.length; particle++) {
				delete particles[removeMe[particle]];
			}
			removeMe.length = 0;
		};
		
		//------------------------------------------------------------------
		//
		// When a particle system is first created, this function is empty.
		// Once the texture for the particle system is loaded, this function
		// gets replaced with one that will actually render things.
		that.render = function() {
			var value,
				particle;
			
			for (value in particles) {
				if (particles.hasOwnProperty(value)) {
					particle = particles[value];
					graphics.drawImage(particle);
				}
			}
		};
		
		that.reset = function() {
			for (var value in particles) {
				if (particles.hasOwnProperty(value)) {
					delete particles[value];
				}
			}
		};
	
		return that;
	}
	
	return {
		initialize: initialize,
	}
	
}(GAME.graphics));
