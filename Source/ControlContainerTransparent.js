
function ControlContainerTransparent(containerInner)
{
	this.containerInner = containerInner;

	// Helper variables.
	this.drawPos = new Coords();
	this.drawLoc = new Location(this.drawPos);
}

{
	// instance methods

	ControlContainerTransparent.prototype.childWithFocus = function()
	{
		return this.containerInner.childWithFocus();
	}

	ControlContainerTransparent.prototype.childWithFocusNextInDirection = function(direction)
	{
		return this.containerInner.childWithFocusNextInDirection(direction);
	}

	ControlContainerTransparent.prototype.childrenAtPosAddToList = function
	(
		posToCheck,
		listToAddTo,
		addFirstChildOnly
	)
	{
		return this.containerInner.childrenAtPosAddToList
		(
			posToCheck, listToAddTo, addFirstChildOnly
		);
	}

	ControlContainerTransparent.prototype.actionHandle = function(universe, actionNameToHandle)
	{
		return this.containerInner.actionHandle(universe, actionNameToHandle);
	}

	ControlContainerTransparent.prototype.mouseClick = function(mouseClickPos)
	{
		return this.containerInner.mouseClick(mouseClickPos);
	}

	ControlContainerTransparent.prototype.mouseMove = function(mouseMovePos)
	{
		return this.containerInner.mouseMove(mouseMovePos);
	}

	// drawable

	ControlContainerTransparent.prototype.draw = function(universe, display, drawLoc)
	{
		drawLoc = this.drawLoc.overwriteWith(drawLoc);
		var drawPos = this.drawPos.overwriteWith(drawLoc.pos).add(this.containerInner.pos);

		display.drawRectangle
		(
			drawPos, this.containerInner.size,
			null, // display.colorBack, 
			display.colorFore
		)

		var children = this.containerInner.children;
		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			child.drawLoc.overwriteWith(drawLoc);
			child.draw(universe, display, child.drawLoc);
		}
	}
}
