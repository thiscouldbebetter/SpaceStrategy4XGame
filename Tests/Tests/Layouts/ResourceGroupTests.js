"use strict";
class ResourceGroupTests extends TestFixture {
    constructor() {
        super(ResourceGroupTests.name);
    }
    tests() {
        return [this.add, this.isSupersetOf, this.subtract];
    }
    resourceGroupBuild() {
        var resourceDefnName = "todo";
        var quantityMax = 5;
        var quantityRandom = Math.floor(Math.random() * quantityMax);
        var resource = new Resource(resourceDefnName, quantityRandom);
        var resources = [resource];
        var returnValue = new ResourceGroup(resources);
        return returnValue;
    }
    // Tests.
    add() {
        var resourceGroup = this.resourceGroupBuild();
        var resourceGroupOther = this.resourceGroupBuild();
        resourceGroup.add(resourceGroupOther);
    }
    isSupersetOf() {
        var resourceGroup = this.resourceGroupBuild();
        var isSupersetOfSelf = resourceGroup.isSupersetOf(resourceGroup);
        Assert.isTrue(isSupersetOfSelf);
    }
    subtract() {
        var resourceGroup = this.resourceGroupBuild();
        resourceGroup.subtract(resourceGroup);
    }
}
