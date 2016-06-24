

function ControlButton(name, pos, size, text, dataBindingForIsEnabled, click)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.text = text;
	this.dataBindingForIsEnabled = dataBindingForIsEnabled;
	this.click = click;

	if (this.dataBindingForIsEnabled == null)
	{
		this.dataBindingForIsEnabled = new DataBinding(true);
	}

	this.isHighlighted = false;	
}

{
	ControlButton.prototype.draw = function(pos)
	{
		Globals.Instance.displayHelper.drawControlButton(this, pos);
	}

	ControlButton.prototype.isEnabled = Control.isEnabled;

	ControlButton.prototype.mouseClick = function(clickPos)
	{
		if (this.isEnabled() == true)
		{
			this.click();
		}
		Globals.Instance.inputHelper.isMouseLeftPressed = false;
	}

	ControlButton.prototype.mouseEnter = function(mouseMovePos)
	{
		this.isHighlighted = true;
	}

	ControlButton.prototype.mouseExit = function(mouseMovePos)
	{
		this.isHighlighted = false;
	}
}
