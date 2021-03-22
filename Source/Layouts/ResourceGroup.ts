
class ResourceGroup
{
	resources: Resource[];

	constructor(resources: Resource[])
	{
		this.resources = resources;
	}

	add(other: ResourceGroup)
	{
		Resource.add(this.resources, other.resources);
		return this;
	}

	isSupersetOf(other: ResourceGroup)
	{
		return Resource.isSupersetOf(this.resources, other.resources);
	}

	subtract(other: ResourceGroup)
	{
		Resource.subtract(this.resources, other.resources);
		return this;
	}
}
