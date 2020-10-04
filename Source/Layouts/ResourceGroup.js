
class ResourceGroup
{
	constructor(resources)
	{
		this.resources = resources;
	}

	add(other)
	{
		this.resources.add(other.resources);
		return this;
	}

	isSupersetOf(other)
	{
		return Resource.isSupersetOf(this.resources, other.resources);
	}

	subtract(other)
	{
		this.resources.subtract(other);
		return this;
	}
}
