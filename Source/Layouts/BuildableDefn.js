"use strict";
class BuildableDefn {
    constructor(name, isItem, canBeBuiltOnMapAtPosInCells, sizeInPixels, visual, industryToBuild, effectPerRound, effectsAvailableToUse, categories, entityProperties, entityModifyOnBuild) {
        this.name = name;
        this.isItem = isItem;
        this._canBeBuiltOnMapAtPosInCells = canBeBuiltOnMapAtPosInCells;
        this.sizeInPixels = sizeInPixels;
        this.visual = this.visualWrapWithOverlay(visual);
        this.industryToBuild = industryToBuild;
        this.effectPerRound = effectPerRound;
        this.effectsAvailableToUse = effectsAvailableToUse || new Array();
        this.categories = categories || new Array();
        this.entityProperties = entityProperties;
        this._entityModifyOnBuild = entityModifyOnBuild;
    }
    buildableToEntity(buildable, world) {
        var properties = new Array();
        properties.push(buildable);
        properties.push(buildable.locatable());
        properties.push(Drawable.fromVisual(this.visual));
        var returnEntity = new Entity(this.name, properties);
        var uwpe = new UniverseWorldPlaceEntities(null, world, null, returnEntity, null);
        if (this.entityProperties != null) {
            var propertiesActualized = this.entityProperties(uwpe);
            propertiesActualized.forEach(x => returnEntity.propertyAdd(x));
        }
        if (this.isItem) {
            returnEntity.propertyAdd(new Item(this.name, 1));
        }
        this.entityModifyOnBuild(uwpe);
        return returnEntity;
    }
    canBeBuiltOnMapAtPosInCells(map, posInCells) {
        return this._canBeBuiltOnMapAtPosInCells(map, posInCells);
    }
    effectPerRoundApply(uwpe) {
        this.effectPerRound.apply(uwpe);
    }
    entityModifyOnBuild(uwpe) {
        if (this._entityModifyOnBuild != null) {
            this._entityModifyOnBuild(uwpe);
        }
    }
    nameAndCost() {
        return this.name + " (" + this.industryToBuild + ")";
    }
    visualWrapWithOverlay(visualToWrap) {
        var visualOverlayShadedRectangle = VisualRectangle.fromSizeAndColorFill(this.sizeInPixels, Color.byName("BlackHalfTransparent"));
        var visualOverlayText = VisualText.fromTextBindingFontAndColor(DataBinding.fromGet((c) => {
            var buildableProgress = "";
            var venueCurrent = c.universe.venueCurrent();
            var venueCurrentTypeName = venueCurrent.constructor.name;
            // hack
            var venueLayout = (venueCurrentTypeName == VenueFader.name
                ?
                    venueCurrent.venueToFadeTo().constructor.name == VenueLayout.name
                        ? venueCurrent.venueToFadeTo()
                        : venueCurrent.venueToFadeFrom()
                : venueCurrent);
            var planet = venueLayout.modelParent;
            buildableProgress = planet.industryBuildableProgress(c.universe);
            return buildableProgress;
        }), FontNameAndHeight.fromHeightInPixels(this.sizeInPixels.y / 2), Color.byName("White"));
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
        var buildableAsEntity = uwpe.entity;
        var buildable = Buildable.ofEntity(buildableAsEntity);
        return (buildable.isComplete ? ["Complete"] : ["Incomplete"]);
    }
    // Clonable.
    clone() {
        throw new Error("Not yet implemented.");
    }
    overwriteWith(other) {
        throw new Error("Not yet implemented.");
    }
}
