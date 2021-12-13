"use strict";
class ProjectileTests extends TestFixture {
    constructor() {
        super(ProjectileTests.name);
    }
    tests() {
        var returnTests = [this.bodyDefnBuild];
        return returnTests;
    }
    // Tests.
    bodyDefnBuild() {
        var bodyDefn = Projectile.bodyDefnBuild();
        Assert.isNotNull(bodyDefn);
    }
}
