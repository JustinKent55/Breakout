//------------------------------------------------------------------
//
// Game object used for drawing, keyboard input, canvas rendering
GAME.graphics = (function() {
	'use strict';
	
	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d');
	
	//------------------------------------------------------------------
	//
	// Place a 'clear' function on the Canvas prototype, this makes it a part
	// of the canvas, rather than making a function that calls and does it.
	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};
	
	//------------------------------------------------------------------
	//
	// Public function that allows the client code to clear the canvas.
	function clear() {
		context.clear();
	}
	
	//------------------------------------------------------------------
	//
	// This is used to create a texture function that can be used by client
	// code for rendering.
	function drawImage(spec) {
			context.save();
			
			context.translate(spec.center.x, spec.center.y);
			context.rotate(spec.rotation);
			context.translate(-spec.center.x, -spec.center.y);
			
			context.drawImage(
				spec.image, 
				spec.center.x - spec.width/2, 
				spec.center.y - spec.height/2,
				spec.width, spec.height);
			
			context.restore();	
	}
	
	//------------------------------------------------------------------
	//
	// This is used to create a text function that can be used by client
	// code for rendering.
	function drawText(spec) {
		context.save();
			
		context.font = spec.font;
		context.fillStyle = spec.fill;
		context.strokeStyle = spec.stroke;
		context.textBaseline = 'top';

		//context.translate(spec.pos.x + that.width / 2, spec.pos.y + that.height / 2);
		//context.rotate(spec.rotation);
		//context.translate(-(spec.pos.x + that.width / 2), -(spec.pos.y + that.height / 2));

		context.fillText(spec.text, spec.pos.x, spec.pos.y);
		context.strokeText(spec.text, spec.pos.x, spec.pos.y);
		
		context.restore();
	}

	return {
		clear: clear,
		drawImage: drawImage,
		drawText: drawText 
	};
}());