
// extensions

function ArrayExtensions()
{
	// do nothing
}

{
	Array.prototype.addLookups = function(keyName)
	{
		for (var i = 0; i < this.length; i++)
		{
			var item = this[i];
			var key = DataBinding.get(item, keyName);
			this[key] = item;
		}
	}

	Array.prototype.intersectionWith = function(other)
	{
		var returnValues = [];

		for (var i = 0; i < this.length; i++)
		{
			var item = this[i];

			if (other.indexOf(item) >= 0)
			{
				returnValues.push(item);
			}
		}

		return returnValues;
	}
}
