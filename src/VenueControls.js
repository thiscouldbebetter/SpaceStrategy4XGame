
function VenueControls(controlRoot, venueParent)
{
	this.controlRoot = controlRoot;
	this.venueParent = venueParent;
}

{
	VenueControls.prototype.draw = function()
	{
		this.controlRoot.draw(Coords.Instances.Zeroes);
	}

	VenueControls.prototype.initialize = function()
	{
		// do nothing
	}

	VenueControls.prototype.updateForTimerTick = function()
	{
		this.draw();

		var inputHelper = Globals.Instance.inputHelper;
		if (inputHelper.isMouseLeftPressed == true)
		{
			var mouseClickPos = inputHelper.mouseClickPos;
			this.controlRoot.mouseClick(mouseClickPos, Coords.Instances.Zeroes);

			// inputHelper.isMouseLeftPressed = false;
		}
		else if (inputHelper.keyCodePressed != null)
		{
			var keyCodePressed = inputHelper.keyCodePressed;
			var isShiftKeyPressed = inputHelper.isShiftKeyPressed;
			this.controlRoot.keyPressed
			(
				keyCodePressed, 
				isShiftKeyPressed
			);
		}

		var mouseMovePos = inputHelper.mouseMovePos;
		var mouseMovePosPrev = inputHelper.mouseMovePosPrev;

		if (mouseMovePos.equals(mouseMovePosPrev) == false)
		{
			this.controlRoot.mouseMove
			(
				mouseMovePos, Coords.Instances.Zeroes
			);
		}
	}
}
