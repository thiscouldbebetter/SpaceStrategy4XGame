
class ResourceGroupTests extends TestFixture
{
	constructor() // resources: Resource[])
	{
		super(ResourceGroupTests.name);
	}

	tests(): ( ()=>void )[]
	{
		return [ this.add, this.isSupersetOf, this.subtract ];
	}

	resourceGroupBuild(): ResourceGroup
	{
		var resourceDefnName = "todo";
		var quantityMax = 5;
		var quantityRandom = Math.floor(Math.random() * quantityMax);
		var resource = new Resource(resourceDefnName, quantityRandom);
		var resources = [ resource ];
		var returnValue = new ResourceGroup(resources);
		return returnValue;
	}

	// Tests.

	add(): void // other: ResourceGroup)
	{
		var resourceGroup = this.resourceGroupBuild();
		var resourceGroupOther = this.resourceGroupBuild();
		resourceGroup.add(resourceGroupOther);
	}

	isSupersetOf(): void // other: ResourceGroup)
	{
		var resourceGroup = this.resourceGroupBuild();
		var isSupersetOfSelf = resourceGroup.isSupersetOf(resourceGroup);
		Assert.isTrue(isSupersetOfSelf);
	}

	subtract(): void // other: ResourceGroup)
	{
		var resourceGroup = this.resourceGroupBuild();
		resourceGroup.subtract(resourceGroup);
	}
}
