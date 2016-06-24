
function InputHelper()
{
	this.keyCodePressed = null;
	this.isShiftKeyPressed = false;
	this.isMouseLeftPressed = false;
	this.mouseClickPos = new Coords(0, 0);
	this.mouseMovePos = new Coords(0, 0);
	this.mouseMovePosPrev = new Coords(0, 0);

	this.tempPos = new Coords(0, 0);
}

{
	InputHelper.prototype.handleEventKeyDown = function(event)
	{
		if (this.isEnabled == true)
		{
			event.preventDefault();
			this.isShiftKeyPressed = event.shiftKey;
			this.keyCodePressed = event.keyCode;
		}
	}

	InputHelper.prototype.handleEventKeyUp = function(event)
	{
		this.keyCodePressed = null;
	}

	InputHelper.prototype.handleEventMouseDown = function(event)
	{
		if (this.isEnabled == true)
		{
			this.isMouseLeftPressed = true;
			this.mouseClickPos.overwriteWithDimensions
			(
				event.layerX,
				event.layerY,
				0
			);
		}
	}

	InputHelper.prototype.handleEventMouseMove = function(event)
	{
		if (this.isEnabled == true)
		{
			this.mouseMovePosPrev.overwriteWith
			(
				this.mouseMovePos
			);
		
			this.mouseMovePos.overwriteWithDimensions
			(
				event.layerX,
				event.layerY,
				0
			);
		}
	}

	InputHelper.prototype.handleEventMouseUp = function(event)
	{
		this.isMouseLeftPressed = false;
	}	

	InputHelper.prototype.initialize = function()
	{
		document.body.onkeydown = this.handleEventKeyDown.bind(this);
		document.body.onkeyup = this.handleEventKeyUp.bind(this);
		var divMain = Globals.Instance.divMain;
		divMain.onmousedown = this.handleEventMouseDown.bind(this);
		divMain.onmousemove = this.handleEventMouseMove.bind(this);
		divMain.onmouseup = this.handleEventMouseUp.bind(this);

		this.isEnabled = true;
	}
}
