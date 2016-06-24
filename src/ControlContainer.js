
function ControlContainer(name, colorsForeAndBack, pos, size, children)
{
	if (colorsForeAndBack == null)
	{
		colorsForeAndBack = [ "Gray", "rgba(0, 0, 0, 0)" ];	
	}

	this.name = name;
	this.colorsForeAndBack = colorsForeAndBack;
	this.pos = pos;
	this.size = size;
	this.children = children;

	this.children.addLookups("name");

	this.indexOfChildWithFocus = null;
	this.childrenContainingPos = [];
	this.childrenContainingPosPrev = [];
}

{
	// instance methods

	ControlContainer.prototype.childWithFocus = function()
	{
		var returnValue = 
		(
			this.indexOfChildWithFocus == null 
			? null 
			: this.children[this.indexOfChildWithFocus]
		);

		return returnValue;
	}

	ControlContainer.prototype.childrenAtPosAddToList = function
	(
		posAbsolute,
		posToCheck, 
		listToAddTo, 
		addFirstChildOnly
	)
	{
		var children = this.children;
		for (var i = children.length - 1; i >= 0; i--)
		{
			var child = children[i];
			var childPos = child.pos.clone().add(posAbsolute);

			var doesChildContainPos = posToCheck.isWithinRangeMinMax
			(
				childPos,
				childPos.clone().add(child.size)
			);

			if (doesChildContainPos == true)
			{
				listToAddTo.push(child);
				if (addFirstChildOnly == true)
				{
					break;
				}
			}
		}

		return listToAddTo;
	}

	ControlContainer.prototype.draw = function(pos)
	{
		Globals.Instance.displayHelper.drawControlContainer(this, pos);
	}

	ControlContainer.prototype.keyPressed = function
	(
		keyCodePressed, isShiftKeyPressed
	)
	{
		var childWithFocus = this.childWithFocus();
		if (childWithFocus != null)
		{
			if (childWithFocus.keyPressed != null)
			{
				childWithFocus.keyPressed
				(
					keyCodePressed, isShiftKeyPressed
				);
			}
		}
	}

	ControlContainer.prototype.mouseClick = function(mouseClickPos, pos)
	{
		var childrenContainingPos = this.childrenContainingPos;
		childrenContainingPos.length = 0;
		
		this.childrenAtPosAddToList
		(
			pos,
			mouseClickPos,
			childrenContainingPos,
			true
		);

		for (var i = 0; i < childrenContainingPos.length; i++)
		{
			var child = childrenContainingPos[i];
			if (child.mouseClick != null)
			{
				this.indexOfChildWithFocus = this.children.indexOf(child);
				child.mouseClick(mouseClickPos, pos.clone().add(child.pos));
			}
		}
	}

	ControlContainer.prototype.mouseMove = function(mouseMovePos, pos)
	{
		var temp = this.childrenContainingPosPrev;
		this.childrenContainingPosPrev = this.childrenContainingPos;
		this.childrenContainingPos = temp;

		var childrenContainingPos = this.childrenContainingPos;
		childrenContainingPos.length = 0;
		this.childrenAtPosAddToList
		(
			pos, 
			mouseMovePos,
			childrenContainingPos,
			true
		);

		for (var i = 0; i < childrenContainingPos.length; i++)
		{
			var child = childrenContainingPos[i];

			if (child.mouseMove != null)
			{
				child.mouseMove(mouseMovePos, pos.clone().add(child.pos));
			}
			if (this.childrenContainingPosPrev.indexOf(child) == -1)
			{
				if (child.mouseEnter != null)
				{
					child.mouseEnter();
				}
			}
		}

		for (var i = 0; i < this.childrenContainingPosPrev.length; i++)
		{
			var child = this.childrenContainingPosPrev[i];
			if (childrenContainingPos.indexOf(child) == -1)
			{
				if (child.mouseExit != null)
				{
					child.mouseExit();
				}
			}
		}
	}
}
