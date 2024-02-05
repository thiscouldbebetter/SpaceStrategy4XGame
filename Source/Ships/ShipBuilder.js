"use strict";
class ShipBuilder {
    constructor() {
        this.shipName = "Ship";
        this.buildableDefnsAvailable = null;
        this.buildableDefnAvailableSelected = null;
        this.buildableDefnsToBuild = [];
        this.buildableDefnToBuildSelected = null;
        this.shipHullSizeSelected = null;
        this.statusMessage = "Select available components and click Add to add them to the ship plans.";
    }
    build(universe, venuePrev, faction, sizeDialog) {
        var returnValue = null;
        var categories = BuildableCategory.Instances();
        var doesShipHaveAGenerator = this.buildableDefnsToBuild.some((bd) => bd.categories.some((c) => c == categories.ShipGenerator));
        var doesShipHaveADrive = this.buildableDefnsToBuild.some((bd) => bd.categories.some((c) => c == categories.ShipDrive));
        var doesShipHaveAGeneratorAndDrive = doesShipHaveAGenerator
            && doesShipHaveADrive;
        var canShipBeBuilt = doesShipHaveAGeneratorAndDrive;
        if (canShipBeBuilt == false) {
            var messageLines = [
                "Ships must have generators and drives.",
                "Also, a starlane drive is needed",
                "to leave the home starsystem."
            ];
            var message = messageLines.join("\n");
            var venueToReturnTo = universe.venueCurrent();
            var venue = VenueMessage.fromTextAcknowledgeAndSize(message, () => universe.venueJumpTo(venueToReturnTo), sizeDialog);
            universe.venueJumpTo(venue);
        }
        else {
            var planet = venuePrev.modelParent;
            var shipPosInCells = planet.cellPositionsAvailableToOccupyInOrbit(universe)[0];
            var industryToBuild = this.industryToBuildTotal();
            var shipHullSize = this.shipHullSizeSelected;
            var visual = faction.visualForShipWithHullSize(shipHullSize);
            var effects = BuildableEffect.Instances();
            var effectNone = effects.None;
            var effectsAvailableForUse = Ship.effectsAvailableForUse();
            var shipAsBuildableDefn = new BuildableDefn(this.shipName, false, // isItem
            (m, p) => true, // hack - Should be orbit only.
            Coords.zeroes(), // sizeInPixels
            visual, industryToBuild, // industryToBuild
            effectNone, // effectPerRound
            effectsAvailableForUse, null, // categories
            null, // entityProperties
            null, // modifyOnBuild
            null // description
            );
            /*
            var shipAsBuildable = new Buildable
            (
                shipAsBuildableDefn,
                shipPosInCells,
                false, // isComplete,
                false // isAutomated
            );
            */
            var shipBodyDefn = Ship.bodyDefnBuild(faction.color); // hack - Different hull sizes.
            var shipComponentEntities = this.buildableDefnsToBuild.map((x) => {
                var buildable = Buildable.fromDefn(x);
                var entity = new Entity(x.name, [buildable]);
                return entity;
            });
            var shipEntity = new Ship(this.shipName, this.shipHullSizeSelected, shipBodyDefn, shipPosInCells, faction, shipComponentEntities);
            returnValue = shipEntity;
            // hack
            var shipDrawable = Drawable.fromVisual(shipAsBuildableDefn.visual);
            shipEntity.propertyAdd(shipDrawable);
            var venuePrevAsVenueLayout = venuePrev;
            var layout = venuePrevAsVenueLayout.layout;
            layout.buildableEntityBuild(shipEntity);
            universe.venueTransitionTo(venuePrevAsVenueLayout);
        }
        return returnValue;
    }
    buildableDefnAvailableSelectedSet(value) {
        this.buildableDefnAvailableSelected = value;
        this.statusMessage = value.description;
    }
    buildableDefnToBuildSelectedSet(value) {
        this.buildableDefnToBuildSelected = value;
        this.statusMessage = value.description;
    }
    industryToBuildTotal() {
        var sumSoFar = this.shipHullSizeSelected.industryToBuild;
        this.buildableDefnsToBuild.forEach(x => sumSoFar += x.industryToBuild);
        return sumSoFar;
    }
    componentCount() {
        return this.buildableDefnsToBuild.length;
    }
    componentCountMax() {
        return this.shipHullSizeSelected.componentCountMax;
    }
    componentCountOverMax() {
        return "" + this.componentCount() + "/" + this.componentCountMax();
    }
    // Controls.
    toControl(universe, size, venuePrev) {
        var shipBuilder = this;
        var world = universe.world;
        var faction = world.factionCurrent();
        var researcher = faction.technologyResearcher;
        var buildableDefnsAvailable = researcher.buildablesAvailable(world);
        this.buildableDefnsAvailable =
            buildableDefnsAvailable.filter(x => x.isItem);
        var buildableDefnsAvailableForShipHulls = buildableDefnsAvailable.filter(x => x.name.indexOf("Hull") >= 0);
        this.buildableDefnsForHulls = buildableDefnsAvailableForShipHulls;
        var shipHullSizeNamesAvailable = buildableDefnsAvailableForShipHulls.map(x => x.name.split(" ")[0]);
        var shipHullSizesAvailable = shipHullSizeNamesAvailable.map(x => ShipHullSize.byName(x));
        this.shipHullSizesAvailable = shipHullSizesAvailable;
        this.shipHullSizeSelected = this.shipHullSizesAvailable[0];
        if (size == null) {
            size = universe.display.sizeDefault();
        }
        var sizeDialog = size.clone().half();
        var margin = 8;
        var fontHeight = margin * 2;
        var font = FontNameAndHeight.fromHeightInPixels(fontHeight);
        var buttonSize = Coords.fromXY(4, 2).multiplyScalar(fontHeight);
        var labelHeight = margin * 3;
        var listSize = Coords.fromXY((size.x - margin * 3) / 2, size.y - margin * 7 - buttonSize.y - labelHeight * 4);
        var back = () => {
            universe.venueTransitionTo(venuePrev);
        };
        var add = () => {
            var componentsToBuildCount = this.componentCount();
            var componentsToBuildMax = this.componentCountMax();
            var canAddMoreComponents = (componentsToBuildCount < componentsToBuildMax);
            if (canAddMoreComponents) {
                var buildableDefnToAdd = shipBuilder.buildableDefnAvailableSelected;
                if (buildableDefnToAdd != null) {
                    shipBuilder.buildableDefnsToBuild.push(buildableDefnToAdd);
                }
            }
        };
        var remove = () => {
            var buildableDefnToRemove = shipBuilder.buildableDefnToBuildSelected;
            if (buildableDefnToRemove != null) {
                var buildableDefnsToBuild = shipBuilder.buildableDefnsToBuild;
                buildableDefnsToBuild.splice(buildableDefnsToBuild.indexOf(buildableDefnToRemove), 1);
            }
        };
        var labelName = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin), // pos
        Coords.fromXY(listSize.x, labelHeight), // size
        DataBinding.fromContext("Name:"), font);
        var textName = new ControlTextBox("textName", Coords.fromXY(margin * 12, margin), // pos
        Coords.fromXY(listSize.x / 2, labelHeight), // size
        new DataBinding(this, (c) => c.shipName, (c, v) => c.shipName = v), // text
        font, 32, // charCountMax
        DataBinding.fromTrue() // isEnabled
        );
        var nameRandomize = () => {
            shipBuilder.shipName = NameGenerator.generateName();
        };
        var buttonNameRandomize = ControlButton.from5(textName.pos.clone().addXY(textName.size.x + margin, 0), Coords.fromXY(buttonSize.x * 1.5, textName.size.y), "Randomize", font, nameRandomize // click
        );
        var labelHullSize = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin * 2 + labelHeight), // pos
        Coords.fromXY(listSize.x, labelHeight), // size
        DataBinding.fromContext("Hull Size:"), font);
        var selectHullSize = new ControlSelect("selectHullSize", Coords.fromXY(margin * 12, margin * 2 + labelHeight), // pos
        Coords.fromXY(labelHeight * 3, labelHeight), // size
        new DataBinding(this, (c) => c.shipHullSizeSelected, (c, v) => c.shipHullSizeSelected = v), // valueSelected
        DataBinding.fromContextAndGet(this, (c) => c.shipHullSizesAvailable), // options
        DataBinding.fromGet((c) => c), // bindingForOptionValues,
        DataBinding.fromGet((c) => c.name), // bindingForOptionText
        font);
        var labelComponentsAvailable = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin * 3 + labelHeight * 2), // pos
        Coords.fromXY(listSize.x, labelHeight), // size
        DataBinding.fromContext("Components Available:"), font);
        var listComponentsAvailable = ControlList.from10("listComponentsAvailable", Coords.fromXY(margin, margin * 4 + labelHeight * 3), // pos
        listSize.clone(), DataBinding.fromContextAndGet(this, (c) => c.buildableDefnsAvailable), // items
        DataBinding.fromGet((c) => c.nameAndCost()), // bindingForItemText
        font, new DataBinding(this, (c) => c.buildableDefnAvailableSelected, (c, v) => c.buildableDefnAvailableSelectedSet(v)), // bindingForItemSelected
        DataBinding.fromGet((c) => c), // bindingForItemValue
        DataBinding.fromTrue(), // isEnabled
        add // confirm
        );
        var labelShipItems = ControlLabel.from4Uncentered(Coords.fromXY(size.x - margin - listSize.x, margin * 3 + labelHeight * 2), // pos
        Coords.fromXY(listSize.x, labelHeight), // size
        DataBinding.fromContext("Components to Build into Ship:"), font);
        var textComponentCountOverMax = ControlLabel.from4Uncentered(Coords.fromXY(size.x - margin - listSize.x + listSize.x * 0.57, margin * 3 + labelHeight * 2), // pos
        Coords.fromXY(labelHeight * 8, labelHeight), // size
        DataBinding.fromContextAndGet(this, (c) => c.componentCountOverMax()), font);
        var labelCost = ControlLabel.from4Uncentered(Coords.fromXY(size.x - margin - listSize.x + listSize.x * 0.82, margin * 3 + labelHeight * 2), // pos
        Coords.fromXY(listSize.x, labelHeight), // size
        DataBinding.fromContext("Cost:"), font);
        var textCost = ControlLabel.from4Uncentered(Coords.fromXY(size.x - margin - listSize.x + listSize.x * 0.92, margin * 3 + labelHeight * 2), // pos
        Coords.fromXY(labelHeight * 8, labelHeight), // size
        DataBinding.fromContextAndGet(this, (c) => "" + c.industryToBuildTotal()), font);
        var buttonAdd = ControlButton.from8("buttonAdd", Coords.fromXY(size.x / 2 - buttonSize.x - margin / 2, size.y - margin * 2 - labelHeight - buttonSize.y), // pos
        buttonSize.clone(), "Add", font, true, // hasBorder
        DataBinding.fromTrue(), // isEnabled
        add // click
        );
        var listShipComponents = ControlList.from10("listShipComponents", Coords.fromXY(size.x - margin - listSize.x, margin * 4 + labelHeight * 3), // pos
        listSize.clone(), DataBinding.fromContextAndGet(this, (c) => c.buildableDefnsToBuild), // items
        DataBinding.fromGet((c) => c.name), // bindingForItemText
        font, new DataBinding(this, (c) => c.buildableDefnToBuildSelected, (c, v) => c.buildableDefnToBuildSelectedSet(v)), // bindingForItemSelected
        DataBinding.fromGet((c) => c), // bindingForItemValue
        DataBinding.fromTrue(), // isEnabled
        remove // confirm
        );
        var buttonRemove = ControlButton.from8("buttonRemove", Coords.fromXY(size.x / 2 + margin / 2, size.y - margin * 2 - labelHeight - buttonSize.y), // pos
        buttonSize.clone(), "Remove", font, true, // hasBorder
        DataBinding.fromTrue(), // isEnabled
        remove // click
        );
        var infoStatus = ControlLabel.from4Uncentered(Coords.fromXY(margin, size.y - margin - labelHeight), // pos
        Coords.fromXY(size.x, fontHeight), // size
        DataBinding.fromContextAndGet(this, c => c.statusMessage), font);
        var buttonCancel = ControlButton.from5(Coords.fromXY(size.x - margin * 2 - buttonSize.x * 2, size.y - margin - buttonSize.y), // pos
        buttonSize.clone(), "Cancel", font, back // click
        );
        var buttonBuild = ControlButton.from5(Coords.fromXY(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y), // pos
        buttonSize.clone(), "Build", font, () => this.build(universe, venuePrev, faction, sizeDialog) // click
        );
        var returnValue = new ControlContainer("containerShipBuilder", Coords.create(), // pos
        size.clone(), 
        // children
        [
            labelName,
            textName,
            buttonNameRandomize,
            labelHullSize,
            selectHullSize,
            labelComponentsAvailable,
            listComponentsAvailable,
            buttonAdd,
            labelShipItems,
            textComponentCountOverMax,
            labelCost,
            textCost,
            listShipComponents,
            buttonRemove,
            infoStatus,
            buttonCancel,
            buttonBuild
        ], [new Action("Back", back)], [new ActionToInputsMapping("Back", [Input.Names().Escape], true)]);
        return returnValue;
    }
}
class ShipHullSize {
    constructor(name, industryToBuild, componentCountMax, integrityMax) {
        this.name = name;
        this.industryToBuild = industryToBuild;
        this.componentCountMax = componentCountMax;
        this.integrityMax = integrityMax || 10;
    }
    static Instances() {
        if (ShipHullSize._instances == null) {
            ShipHullSize._instances = new ShipHullSize_Instances();
        }
        return ShipHullSize._instances;
    }
    static byName(name) {
        return ShipHullSize.Instances().byName(name);
    }
    strategicValue() {
        return this.industryToBuild;
    }
}
class ShipHullSize_Instances {
    constructor() {
        this.Small = new ShipHullSize("Small", 0, 5, 5);
        this.Medium = new ShipHullSize("Medium", 0, 10, 10);
        this.Large = new ShipHullSize("Large", 0, 15, 15);
        this.Enormous = new ShipHullSize("Enormous", 0, 25, 25);
        this._All =
            [
                this.Small,
                this.Medium,
                this.Large,
                this.Enormous
            ];
    }
    byName(name) {
        return this._All.find(x => x.name == name);
    }
}
