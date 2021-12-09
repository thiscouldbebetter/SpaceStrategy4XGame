"use strict";
class BuildableDefn {
    constructor(name, isItem, terrainNamesAllowed, visual, resourcesToBuild, resourcesPerTurn, entityModifyOnBuild) {
        this.name = name;
        this.isItem = isItem;
        this.terrainNamesAllowed = terrainNamesAllowed;
        this.visual = visual;
        this.resourcesToBuild = resourcesToBuild;
        this.resourcesPerTurn = resourcesPerTurn;
        this.entityModifyOnBuild = entityModifyOnBuild;
    }
    buildableToEntity(buildable) {
        var returnValue = new Entity(this.name, [
            buildable,
            buildable.locatable(),
            Drawable.fromVisual(this.visual)
        ]);
        if (this.isItem) {
            returnValue.propertyAdd(new Item(this.name, 1));
        }
        if (this.entityModifyOnBuild != null) {
            this.entityModifyOnBuild(returnValue);
        }
        return returnValue;
    }
}
