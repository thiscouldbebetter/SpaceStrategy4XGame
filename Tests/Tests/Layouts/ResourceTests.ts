
class ResourceTests extends TestFixture
{
	constructor() // defnName: string, quantity: number)
	{
		super(ResourceTests.name);
	}

	tests(): ( ()=>void )[]
	{
		return [ this.add, this.isSupersetOf, this.subtract, this.toString ];
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

	add(): void
	{
		var resource0 = this.resourceBuild();
		var resource1 = this.resourceBuild();

		var resource0QuantityBefore = resource0.quantity;

		var resources0 = [ resource0 ];
		var resources1 = [ resource1 ];

		Resource.add(resources0, resources1);

		var resource0QuantityAfterExpected =
			resource0QuantityBefore + resource1.quantity;
		Assert.areNumbersEqual(resource0QuantityAfterExpected, resource0.quantity);
	}

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
