
function Resource(defnName, quantity)
{
	this.defnName = defnName;
	this.quantity = quantity;
}
{
	Resource.add = function(resourcesToAddTo, resourcesToBeAdded)
	{
		for (var r = 0; r < resourcesToBeAdded.length; r++)
		{
			var resourceToBeAdded = resourcesToBeAdded[r];
			var resourceDefnName = resourceToBeAdded.defnName;
			var resourceExisting = resourcesToAddTo[resourceDefnName];
			if (resourceExisting == null)
			{
				resourceExisting = new Resource(resourceDefnName, 0);
				resourcesToAddTo.push(resourceExisting);
				resourcesToAddTo[resourceDefnName] = resourceExisting;
			}
			resourceExisting.quantity += resourceToBeAdded.quantity;
		}
	};

	Resource.isSupersetOf = function(resourcesThis, resourcesOther)
	{
		var returnValue = true;

		for (var i = 0; i < resourcesOther.length; i++)
		{
			var resourceOther = resourcesOther[i];
			var resourceOtherDefnName = resourceOther.defnName;

			var resourceThisFound = null;
			for (var j = 0; j < resourcesThis.length; j++)
			{
				var resourceThis = resourcesThis[j];
				var resourceThisDefnName = resourceThis.defnName;
				if (resourceThisDefnName == resourceOtherDefnName)
				{
					resourceThisFound = resourceThis;
					break;
				}
			}

			var resourceThisQuantity = (resourceThisFound == null ? 0 : resourceThisFound.quantity);
			if (resourceThisQuantity < resourceOther.quantity)
			{
				returnValue = false;
				break;
			}
		}

		return returnValue;
	};

	Resource.subtract = function(resourcesToSubtractFrom, resourcesToBeSubtracted)
	{
		for (var r = 0; r < resourcesToBeSubtracted.length; r++)
		{
			var resourceToBeSubtracted = resourcesToBeSubtracted[r];
			var resourceDefnName = resourceToBeSubtracted.defnName;
			var resourceExisting = resourcesToSubtractFrom[resourceDefnName];
			if (resourceExisting == null)
			{
				resourceExisting = new Resource(resourceDefnName, 0);
				resourcesToSubtractFrom.push(resourceExisting);
				resourcesToSubtractFrom[resourceDefnName] = resourceExisting;
			}
			resourceExisting.quantity -= resourceToBeSubtracted.quantity;
		}
	};

	// instance methods

	Resource.prototype.toString = function()
	{
		return this.defnName + ": " + this.quantity;
	};
}
