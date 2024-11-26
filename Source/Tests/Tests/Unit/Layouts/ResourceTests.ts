
class ResourceTests extends TestFixture
{
	constructor() // defnName: string, quantity: number)
	{
		super(ResourceTests.name);
	}

	tests(): ( ()=>void )[]
	{
		var returnTests =
		[
			this.isSupersetOf,
			this.subtract,
			this.toString
		];
		return returnTests;
	}

	// Setup.

	resourceBuild(): Resource
	{
		var resourceDefnName = "todo";
		var quantityMax = 5;
		var quantityRandom = Math.floor(Math.random() * quantityMax);
		var resource = new Resource(resourceDefnName, quantityRandom);
		return resource;
	}

	// Tests.

	isSupersetOf(): void // resourcesThis: Resource[], resourcesOther: Resource[])
	{
		var resource = this.resourceBuild();
		var resources = [ resource ];
		var isSupersetOfSelf = Resource.isSupersetOf(resources, resources);
		Assert.isTrue(isSupersetOfSelf);
	}

	subtract(): void
	{
		var resource = this.resourceBuild();
		var resources = [ resource ];
		Resource.subtract(resources, resources);
		Assert.areNumbersEqual(0, resource.quantity);
	}

	// instance methods

	toString(): void
	{
		var resource = this.resourceBuild();
		var resourceAsString = resource.toString();
		Assert.isNotNull(resourceAsString);
	}
}
