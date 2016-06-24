
function Location(pos)
{
	this.pos = pos;
}

{
	Location.prototype.clone = function()
	{
		return new Location(this.pos.clone());
	}

	Location.prototype.equals = function(other)
	{
		var returnValue = 
		(
			this.pos.equals(other.pos)
		);
		return returnValue;
	}
}
