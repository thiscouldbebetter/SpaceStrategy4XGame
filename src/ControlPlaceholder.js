
function ControlPlaceholder(name, pos, size, textToDisplayIfEmpty, dataBinding)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.textToDisplayIfEmpty = textToDisplayIfEmpty;
	this.dataBinding = dataBinding;

	this.controlLabelToDisplayIfEmpty = new ControlLabel
	(
		this.name + "_Empty",
		this.pos,
		new Coords(0, 0), // this.size
		false, // isTextCentered
		new DataBinding(this.textToDisplayIfEmpty)
	);
}

{
	ControlPlaceholder.prototype.childWithFocus = function()
	{
		return this.controlBound().childWithFocus();
	}

	ControlPlaceholder.prototype.childrenAtPosAddToList = function
	(
		posAbsolute,
		posToCheck, 
		listToAddTo, 
		addFirstChildOnly
	)
	{
		return this.controlBound().childrenAtPosAddtoList
		(
			posAbsolute, posToCheck, listToAddTo, addFirstChildOnly
		);
	}

	ControlPlaceholder.prototype.controlBound = function()
	{
		var returnValue = this.dataBinding.get();

		if (returnValue == null)
		{
			returnValue = this.controlLabelToDisplayIfEmpty;
		}

		return returnValue;
	}

	ControlPlaceholder.prototype.draw = function(pos)
	{
		this.controlBound().draw(pos);
	}

	ControlPlaceholder.prototype.isEnabled = function()
	{
		return this.controlBound().isEnabled();
	}

	ControlPlaceholder.prototype.mouseClick = function(mouseClickPos, pos)
	{
		var controlBound = this.controlBound();
		if (controlBound.mouseClick != null)
		{
			controlBound.mouseClick(mouseClickPos, pos);
		}
	}

	ControlPlaceholder.prototype.mouseEnter = function(mouseMovePos)
	{
		// fix - see mouseClick
		var mouseEnter = this.controlBound().mouseEnter;
		if (mouseEnter != null) 
		{
			mouseEnter(mouseMovePos); 
		}
	}

	ControlPlaceholder.prototype.mouseExit = function(mouseMovePos)
	{
		// fix - see mouseClick
		var mouseExit = this.controlBound().mouseExit;
		if (mouseExit != null)
		{
			mouseExit(mouseMovePos);
		}
	}
}
