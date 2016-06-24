
function ControlTextBox(name, pos, size, dataBindingForText)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.dataBindingForText = dataBindingForText;

	if (this.dataBindingForText.constructor.name == "String")
	{
		// hack
		this.dataBindingForText = new DataBinding(this.dataBindingForText);
	}

	this.isHighlighted = false;
}

{
	ControlTextBox.prototype.draw = function(pos)
	{
		Globals.Instance.displayHelper.drawControlTextBox(this, pos);
	}
	
	ControlTextBox.prototype.keyPressed = function(keyCodePressed, isShiftKeyPressed)
	{
		var text = this.text();
		if (keyCodePressed == 8) // backspace
		{
			text = text.substr(0, this.text.length - 1);
		}
		else
		{
			var charTyped = String.fromCharCode(keyCodePressed);
			if (isShiftKeyPressed == false)
			{
				charTyped = charTyped.toLowerCase();
			}

			text += charTyped;
		}

		this.dataBindingForText.set(text);

		// hack
		Globals.Instance.inputHelper.keyCodePressed = null;
	}

	ControlTextBox.prototype.mouseClick = function(mouseClickPos)
	{
		this.isHighlighted = true;
	}

	ControlTextBox.prototype.text = function()
	{
		return this.dataBindingForText.get();
	}
}
