"use strict";
class ResourceTests extends TestFixture {
    constructor() {
        super(ResourceTests.name);
    }
    tests() {
        var returnTests = [
            this.isSupersetOf,
            this.subtract,
            this.toString
        ];
        return returnTests;
    }
    // Setup.
    resourceBuild() {
        var resourceDefnName = "todo";
        var quantityMax = 5;
        var quantityRandom = Math.floor(Math.random() * quantityMax);
        var resource = new Resource(resourceDefnName, quantityRandom);
        return resource;
    }
    // Tests.
    isSupersetOf() {
        var resource = this.resourceBuild();
        var resources = [resource];
        var isSupersetOfSelf = Resource.isSupersetOf(resources, resources);
        Assert.isTrue(isSupersetOfSelf);
    }
    subtract() {
        var resource = this.resourceBuild();
        var resources = [resource];
        Resource.subtract(resources, resources);
        Assert.areNumbersEqual(0, resource.quantity);
    }
    // instance methods
    toString() {
        var resource = this.resourceBuild();
        var resourceAsString = resource.toString();
        Assert.isNotNull(resourceAsString);
    }
}
