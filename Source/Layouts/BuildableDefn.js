"use strict";
class BuildableDefn {
    constructor(name, terrainNamesAllowed, visual, resourcesToBuild, resourcesPerTurn
    // todo - use.
    ) {
        this.name = name;
        this.terrainNamesAllowed = terrainNamesAllowed;
        this.visual = visual;
        this.resourcesToBuild = resourcesToBuild;
        this.resourcesPerTurn = resourcesPerTurn;
    }
}
