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
        var projectileDefn = ProjectileDefn.Instances().Default;
        var bodyDefn = Projectile.bodyDefnBuild(projectileDefn);
        Assert.isNotNull(bodyDefn);
    }
}
