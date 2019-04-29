
function ResourceGroup(resources)
{
	this.resources = resources;
}
{
	ResourceGroup.prototype.add = function(other)
	{
		this.resources.add(other.resources);
		return this;
	};

	ResourceGroup.prototype.isSupersetOf = function(other)
	{
		return Resource.isSupersetOf(this.resources, other.resources);
	};

	ResourceGroup.prototype.subtract = function(other)
	{
		this.resources.subtract(other);
		return this;
	};
}
