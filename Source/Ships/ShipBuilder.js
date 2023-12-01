"use strict";
class ShipBuilder {
    constructor() {
        this.buildableDefnsAvailable = null;
        this.buildableDefnAvailableSelected = null;
        this.buildableDefnsToBuild = [];
        this.buildableDefnToBuildSelected = null;
        this.shipHullSizeSelected = null;
        this.statusMessage = "Select available components and click Add to add them to the ship plans.";
    }
    industryToBuildTotal() {
        var sumSoFar = 0;
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
        var margin = 8;
        var fontHeight = margin * 2;
        var font = FontNameAndHeight.fromHeightInPixels(fontHeight);
        var buttonSize = Coords.fromXY(4, 2).multiplyScalar(fontHeight);
        var labelHeight = margin * 3;
        var listSize = Coords.fromXY((size.x - margin * 3) / 2, size.y - margin * 6 - buttonSize.y - labelHeight * 3);
        var back = () => {
            universe.venueTransitionTo(venuePrev);
        };
        var build = () => {
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
                var venue = VenueMessage.fromTextAndAcknowledge(message, () => universe.venueTransitionTo(venueToReturnTo));
                universe.venueTransitionTo(venue);
            }
            else {
                var shipName = "ShipNameTodo"; // todo
                var industryToBuild = shipBuilder.industryToBuildTotal();
                var visual = new VisualNone();
                var effect = BuildableEffect.Instances().None;
                var buildableDefn = new BuildableDefn(shipName, false, // isItem
                ["Orbit"], // terrainsAllowedNames
                Coords.zeroes(), // sizeInPixels
                visual, industryToBuild, // industryToBuild
                effect, null, // categories
                null // modifyOnBuild
                );
                var venuePrevAsVenueLayout = venuePrev;
                var layout = venuePrevAsVenueLayout.layout;
                var shipAsBuildable = Buildable.fromDefn(buildableDefn);
                var shipAsEntity = shipAsBuildable.toEntity(world);
                layout.buildableEntityBuild(shipAsEntity);
                universe.venueTransitionTo(venuePrevAsVenueLayout);
            }
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
        var labelHullSize = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin), // pos
        Coords.fromXY(listSize.x, labelHeight), // size
        DataBinding.fromContext("Hull Size:"), font);
        var selectHullSize = new ControlSelect("selectHullSize", Coords.fromXY(margin * 12, margin), // pos
        Coords.fromXY(labelHeight * 3, labelHeight), // size
        new DataBinding(this, (c) => c.shipHullSizeSelected, (c, v) => c.shipHullSizeSelected = v), // valueSelected
        DataBinding.fromContextAndGet(this, (c) => c.shipHullSizesAvailable), // options
        DataBinding.fromGet((c) => c), // bindingForOptionValues,
        DataBinding.fromGet((c) => c.name), // bindingForOptionText
        font);
        var labelComponentsAvailable = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin * 2 + labelHeight), // pos
        Coords.fromXY(listSize.x, labelHeight), // size
        DataBinding.fromContext("Components Available:"), font);
        var listComponentsAvailable = ControlList.from10("listComponentsAvailable", Coords.fromXY(margin, margin * 3 + labelHeight * 2), // pos
        listSize.clone(), DataBinding.fromContextAndGet(this, (c) => c.buildableDefnsAvailable), // items
        DataBinding.fromGet((c) => c.nameAndCost()), // bindingForItemText
        font, new DataBinding(this, (c) => c.buildableDefnAvailableSelected, (c, v) => c.buildableDefnAvailableSelected = v), // bindingForItemSelected
        DataBinding.fromGet((c) => c), // bindingForItemValue
        DataBinding.fromTrue(), // isEnabled
        add // confirm
        );
        var labelShipItems = ControlLabel.from4Uncentered(Coords.fromXY(size.x - margin - listSize.x, margin * 2 + labelHeight), // pos
        Coords.fromXY(listSize.x, labelHeight), // size
        DataBinding.fromContext("Components to Build into Ship:"), font);
        var textComponentCountOverMax = ControlLabel.from4Uncentered(Coords.fromXY(size.x - margin - listSize.x + listSize.x * 0.57, margin * 2 + labelHeight), // pos
        Coords.fromXY(labelHeight * 8, labelHeight), // size
        DataBinding.fromContextAndGet(this, (c) => c.componentCountOverMax()), font);
        var labelCost = ControlLabel.from4Uncentered(Coords.fromXY(size.x - margin - listSize.x + listSize.x * 0.8, margin * 2 + labelHeight), // pos
        Coords.fromXY(listSize.x, labelHeight), // size
        DataBinding.fromContext("Cost:"), font);
        var textCost = ControlLabel.from4Uncentered(Coords.fromXY(size.x - margin - listSize.x + listSize.x * 0.9, margin * 2 + labelHeight), // pos
        Coords.fromXY(labelHeight * 8, labelHeight), // size
        DataBinding.fromContextAndGet(this, (c) => "" + c.industryToBuildTotal()), font);
        var buttonAdd = ControlButton.from8("buttonAdd", Coords.fromXY(size.x / 2 - buttonSize.x - margin / 2, size.y - margin * 2 - labelHeight - buttonSize.y), // pos
        buttonSize.clone(), "Add", font, true, // hasBorder
        DataBinding.fromTrue(), // isEnabled
        add // click
        );
        var listShipComponents = ControlList.from10("listShipComponents", Coords.fromXY(size.x - margin - listSize.x, margin * 3 + labelHeight * 2), // pos
        listSize.clone(), DataBinding.fromContextAndGet(this, (c) => c.buildableDefnsToBuild), // items
        DataBinding.fromGet((c) => c.name), // bindingForItemText
        font, new DataBinding(this, (c) => c.buildableDefnToBuildSelected, (c, v) => c.buildableDefnToBuildSelected = v), // bindingForItemSelected
        DataBinding.fromGet((c) => c), // bindingForItemValue
        DataBinding.fromTrue(), // isEnabled
        remove // confirm
        );
        var buttonRemove = ControlButton.from8("buttonRemove", Coords.fromXY(size.x / 2 + margin / 2, size.y - margin * 2 - labelHeight - buttonSize.y), // pos
        buttonSize.clone(), "Remove", font, true, // hasBorder
        DataBinding.fromTrue(), // isEnabled
        remove // click
        );
        var infoStatus = ControlLabel.from4CenteredHorizontally(Coords.fromXY(0, size.y - margin - labelHeight), // pos
        Coords.fromXY(size.x, fontHeight), // size
        DataBinding.fromContextAndGet(this, c => c.statusMessage), font);
        var buttonCancel = ControlButton.from5(Coords.fromXY(size.x - margin * 2 - buttonSize.x * 2, size.y - margin - buttonSize.y), // pos
        buttonSize.clone(), "Cancel", font, back // click
        );
        var buttonBuild = ControlButton.from5(Coords.fromXY(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y), // pos
        buttonSize.clone(), "Build", font, build // click
        );
        var returnValue = new ControlContainer("containerShipBuilder", Coords.create(), // pos
        size.clone(), 
        // children
        [
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
    constructor(name, componentCountMax) {
        this.name = name;
        this.componentCountMax = componentCountMax;
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
}
class ShipHullSize_Instances {
    constructor() {
        this.Small = new ShipHullSize("Small", 5);
        this.Medium = new ShipHullSize("Medium", 10);
        this.Large = new ShipHullSize("Large", 15);
        this.Enormous = new ShipHullSize("Enormous", 25);
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
