"use strict";
class BuildableDefn {
    constructor(name, isItem, terrainsAllowedNames, sizeInPixels, visual, industryToBuild, effect, categories, entityModifyOnBuild) {
        this.name = name;
        this.isItem = isItem;
        this.terrainsAllowedNames = terrainsAllowedNames;
        this.sizeInPixels = sizeInPixels;
        this.visual = this.visualWrapWithOverlay(visual);
        this.industryToBuild = industryToBuild;
        this.effect = effect;
        this.categories = categories || new Array();
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
    effectApply(uwpe) {
        this.effect.apply(uwpe);
    }
    isAllowedOnTerrain(terrain) {
        var returnValue = ArrayHelper.contains(this.terrainsAllowedNames, terrain.name);
        return returnValue;
    }
    nameAndCost() {
        return this.name + " (" + this.industryToBuild + ")";
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
        var buildable = Buildable.ofEntity(uwpe.entity2);
        return (buildable.isComplete ? ["Complete"] : ["Incomplete"]);
    }
}
class BuildableCategory {
    constructor(name) {
        this.name = name;
    }
    static Instances() {
        if (BuildableCategory._instances == null) {
            BuildableCategory._instances = new BuildableCategory_Instances();
        }
        return BuildableCategory._instances;
    }
}
class BuildableCategory_Instances {
    constructor() {
        this.ShipDrive = new BuildableCategory("Ship Drive");
        this.ShipGenerator = new BuildableCategory("Ship Generator");
        this.ShipItem = new BuildableCategory("Ship Item");
        this.ShipSensor = new BuildableCategory("Ship Sensor");
        this.ShipShield = new BuildableCategory("Ship Shield");
        this.ShipStarlaneDrive = new BuildableCategory("Ship Starlane Drive");
        this.ShipWeapon = new BuildableCategory("Ship Weapon");
    }
}
class BuildableEffect {
    constructor(name, orderToApplyIn, apply) {
        this.name = name;
        this.orderToApplyIn = orderToApplyIn;
        this._apply = apply;
    }
    static Instances() {
        if (BuildableEffect._instances == null) {
            BuildableEffect._instances = new BuildableEffect_Instances();
        }
        return BuildableEffect._instances;
    }
    static applyManyInOrder(effects, uwpe) {
        var orders = new Array();
        var effectArraysByOrder = new Map();
        effects.forEach(effect => {
            var order = effect.orderToApplyIn;
            if (effectArraysByOrder.has(order) == false) {
                orders.push(order);
                effectArraysByOrder.set(order, []);
            }
            var effectsWithSameOrder = effectArraysByOrder.get(order);
            effectsWithSameOrder.push(effect);
        });
        for (var i = 0; i < orders.length; i++) {
            var order = orders[i];
            var effects = effectArraysByOrder.get(order);
            for (var e = 0; e < effects.length; e++) {
                var effect = effects[e];
                effect.apply(uwpe);
            }
        }
    }
    apply(uwpe) {
        this._apply(uwpe);
    }
}
class BuildableEffect_Instances {
    constructor() {
        this.None = new BuildableEffect("None", 0, (uwpe) => { });
        this.ThrowError = new BuildableEffect("Throw Error", 0, (uwpe) => { throw new Error(BuildableEffect.name); });
    }
}
