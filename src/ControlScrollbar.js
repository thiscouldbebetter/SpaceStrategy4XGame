
function ControlScrollbar
(
	name,
	pos, 
	size,
	dataBindingForMin,
	dataBindingForMax,
	dataBindingForValue
)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.dataBindingForMin = dataBindingForMin;
	this.dataBindingForMax = dataBindingForMax;
	this.dataBindingForValue = dataBindingForValue
}

{
	ControlScrollbar.prototype.draw = function(pos)
	{
		Globals.Instance.displayHelper.drawControlScrollbar(this, pos);
	}

	ControlScrollbar.prototype.max = function()
	{
		return this.dataBindingForMax.get();
	}

	ControlScrollbar.prototype.min = function()
	{
		return this.dataBindingForMin.get();
	}

	ControlScrollbar.prototype.range = function()
	{
		return this.max() - this.min();
	}

	ControlScrollbar.prototype.value = function()
	{
		return this.dataBindingForValue.get();
	}
}
