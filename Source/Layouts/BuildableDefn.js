"use strict";
class BuildableDefn {
    constructor(name, isItem, terrainNamesAllowed, sizeInPixels, visual, industryToBuild, resourcesPerTurn, entityModifyOnBuild) {
        this.name = name;
        this.isItem = isItem;
        this.terrainNamesAllowed = terrainNamesAllowed;
        this.sizeInPixels = sizeInPixels;
        this.visual = this.visualWrapWithOverlay(visual);
        this.industryToBuild = industryToBuild;
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
    isAllowedOnTerrain(terrain) {
        var returnValue = ArrayHelper.contains(this.terrainNamesAllowed, terrain.name);
        return returnValue;
    }
    visualWrapWithOverlay(visualToWrap) {
        var visualOverlayShadedRectangle = VisualRectangle.fromSizeAndColorFill(this.sizeInPixels, Color.byName("BlackHalfTransparent"));
        var visualOverlayText = VisualText.fromTextHeightAndColor("...", this.sizeInPixels.y / 2, Color.byName("White"));
        var visualOverlayTextAndShade = new VisualGroup([
            visualOverlayShadedRectangle,
            visualOverlayText
        ]);
        var visualOverlay = new VisualSelect(new Map([
            ["Complete", new VisualNone()],
            ["Incomplete", visualOverlayTextAndShade]
        ]), this.visualWrap_SelectChildNames);
        var visualWrapped = new VisualGroup([
            visualToWrap,
            visualOverlay
        ]);
        return visualWrapped;
    }
    visualWrap_SelectChildNames(uwpe, d) {
        var buildable = Buildable.fromEntity(uwpe.entity2);
        return (buildable.isComplete ? ["Complete"] : ["Incomplete"]);
    }
}
