
function ControlContainerTransparent(containerInner)
{
	this.containerInner = containerInner;
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

	ControlContainerTransparent.prototype.actionHandle = function(actionNameToHandle)
	{
		return this.containerInner.actionHandle(actionNameToHandle);
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

	ControlContainerTransparent.prototype.drawToDisplayAtLoc = function(display, drawLoc)
	{
		var drawPos = drawLoc.pos.add(this.containerInner.pos);

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
			child.drawToDisplayAtLoc(display, drawLoc.clone());
		}
	}
}
