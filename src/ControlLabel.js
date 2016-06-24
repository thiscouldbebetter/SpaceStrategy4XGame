
function ControlLabel(name, pos, size, isTextCentered, dataBindingForText)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.isTextCentered = isTextCentered;
	this.dataBindingForText = dataBindingForText;

	if (this.dataBindingForText.constructor.name != "DataBinding")
	{
		this.dataBindingForText = new DataBinding(this.dataBindingForText);
	}
}

{
	ControlLabel.prototype.draw = function(pos)
	{
		Globals.Instance.displayHelper.drawControlLabel(this, pos);
	}

	ControlLabel.prototype.text = function()
	{
		return this.dataBindingForText.get();
	}
}
