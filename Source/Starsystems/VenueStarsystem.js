"use strict";
class VenueStarsystem {
    constructor(venueParent, starsystem) {
        this.venueParent = venueParent;
        this.starsystem = starsystem;
        this.cursor = new Cursor();
        this._mouseClickPos = Coords.create();
        this.hasBeenUpdatedSinceDrawn = true;
    }
    draw(universe) {
        var world = universe.world;
        var shouldDraw = world.shouldDrawOnlyWhenUpdated == false
            || this.hasBeenUpdatedSinceDrawn;
        if (shouldDraw) {
            this.hasBeenUpdatedSinceDrawn = false;
            var display = universe.display;
            display.drawBackground(null, null);
            this.starsystem.draw(universe, world, display);
            var uwpe = new UniverseWorldPlaceEntities(universe, world, null, null, null);
            uwpe.entitySet(this.cursor);
            this.cursor.draw(uwpe, display);
            this.venueControls.draw(universe);
        }
    }
    entitiesAreMoving() {
        return this.entityMoving != null;
    }
    entitySelect(value) {
        this._entitySelected = value;
    }
    entitySelected() {
        if (this.starsystem.entityIsPresent(this._entitySelected) == false) {
            this.entitySelectedClear();
        }
        return this._entitySelected;
    }
    entitySelectedClear() {
        this._entitySelected = null;
    }
    entitySelectedDetailsAreViewable(universe) {
        var entitySelectedDetailsAreViewable = false;
        var entitySelected = this.entitySelected();
        if (entitySelected != null) {
            var world = universe.world;
            var factionable = Factionable.ofEntity(entitySelected);
            if (factionable == null) {
                entitySelectedDetailsAreViewable = true;
            }
            else {
                var entitySelectedFaction = factionable.faction();
                var factionCurrent = world.factionCurrent();
                var planet = entitySelected;
                entitySelectedDetailsAreViewable =
                    (entitySelectedFaction == factionCurrent)
                        ||
                            (entitySelectedFaction == null
                                && factionCurrent.knowledge.planetIsKnown(planet));
            }
        }
        return entitySelectedDetailsAreViewable;
    }
    entitySelectedDetailsView(universe) {
        var detailsAreViewable = this.entitySelectedDetailsAreViewable(universe);
        if (detailsAreViewable == false) {
            return;
        }
        var selectedEntity = this.entitySelected();
        if (selectedEntity != null) {
            var venueNext;
            var selectionTypeName = selectedEntity.constructor.name;
            if (selectionTypeName == Planet.name) {
                var selectionAsPlanet = selectedEntity;
                var layout = selectionAsPlanet.layout(universe);
                venueNext = new VenueLayout(this, selectionAsPlanet, layout);
            }
            else if (selectionTypeName == Ship.name) {
                throw new Error("Not yet implemented!");
            }
            if (venueNext != null) {
                universe.venueTransitionTo(venueNext);
            }
        }
    }
    entitySelectedEquals(other) {
        return (this.entitySelected() == other);
    }
    factionsPresent(world) {
        return this.starsystem.factionsPresent(world);
    }
    finalize(universe) {
        // universe.soundHelper.soundForMusicPause(universe);
    }
    initialize(universe) {
        var starsystem = this.starsystem;
        var world = universe.world;
        world.placeCurrent = this.starsystem;
        var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);
        this.venueControls = this.toControl(universe).toVenue();
        var soundHelper = universe.soundHelper;
        soundHelper.soundWithNamePlayAsMusic(universe, "Music_Title");
        var viewSize = universe.display.sizeInPixels.clone();
        var focalLength = viewSize.y;
        viewSize.z = focalLength * 4;
        var camera = new Camera(viewSize, focalLength, Disposition.fromPos(new Coords(0 - focalLength, 0, 0)), null // entitiesSort
        );
        var cameraLocatable = new Locatable(camera.loc);
        var targetForCamera = Coords.create();
        // hack
        var constraints = [
            new Constraint_PositionOnCylinder(targetForCamera, // center
            Orientation.default(), 0, // yaw
            camera.focalLength, // radius
            0 - camera.focalLength / 2 // distanceFromCenterAlongAxisMax
            ),
            new Constraint_LookAt(targetForCamera),
        ];
        var cameraConstrainable = new Constrainable(constraints);
        this.cameraEntity = new Entity(Camera.name, [camera, cameraLocatable, cameraConstrainable]);
        cameraConstrainable.constrain(uwpe.entitySet(this.cameraEntity));
        this.entities = new Array();
        this.entities.push(starsystem.star);
        this.entities.push(...starsystem.linkPortals);
        this.entities.push(...starsystem.planets);
        this.entities.push(...starsystem.ships);
        this.hasBeenUpdatedSinceDrawn = true;
    }
    model() {
        return this.starsystem;
    }
    selectionName(world) {
        var returnValue;
        var entitySelected = this.entitySelected();
        if (entitySelected == null) {
            returnValue = "[none]";
        }
        else {
            var entitySelectedTypeName = entitySelected.constructor.name;
            if (entitySelectedTypeName == LinkPortal.name) {
                var linkPortalSelected = entitySelected;
                returnValue =
                    linkPortalSelected.nameAccordingToFactionPlayerKnowledge(world);
            }
            else {
                returnValue = entitySelected.name;
            }
        }
        return returnValue;
    }
    updateForTimerTick(universe) {
        var world = universe.world;
        var uwpe = new UniverseWorldPlaceEntities(universe, world, this.starsystem, null, null);
        this.cameraEntity.constrainable().constrain(uwpe.entitySet(this.cameraEntity));
        if (this.cursor != null) {
            this.cursor.constrainable().constrain(uwpe.entitySet(this.cursor));
        }
        this.starsystem.updateForTimerTick(uwpe);
        var factionsPresent = this.factionsPresent(world);
        for (var f = 0; f < factionsPresent.length; f++) {
            var faction = factionsPresent[f];
            faction.updateForTimerTick(uwpe);
        }
        this.draw(universe);
        this.venueControls.updateForTimerTick(universe);
        this.updateForTimerTick_Input(universe);
        universe.world.timerTicksSoFar++;
    }
    updateForTimerTick_Input(universe) {
        var cameraSpeed = 10;
        var inputHelper = universe.inputHelper;
        var inputsActive = inputHelper.inputsPressed;
        if (inputsActive.length > 0) {
            this.hasBeenUpdatedSinceDrawn = true;
        }
        for (var i = 0; i < inputsActive.length; i++) {
            var inputActive = inputsActive[i].name;
            if (inputActive == "MouseMove") {
                this.updateForTimerTick_Input_MouseMove(universe);
            }
            else if (inputActive == "a") {
                this.cameraLeft(cameraSpeed);
            }
            else if (inputActive == "d") {
                this.cameraRight(cameraSpeed);
            }
            else if (inputActive == "f") {
                this.cameraDown(cameraSpeed);
            }
            else if (inputActive == "r") {
                this.cameraUp(cameraSpeed);
            }
            else if (inputActive == "s") {
                this.cameraOut(cameraSpeed);
            }
            else if (inputActive == "w") {
                this.cameraIn(cameraSpeed);
            }
            else if (inputHelper.isMouseClicked()) {
                this.updateForTimerTick_Input_Mouse(universe);
            }
        }
    }
    updateForTimerTick_Input_Mouse(universe) {
        universe.soundHelper.soundWithNamePlayAsEffect(universe, "Sound");
        var inputHelper = universe.inputHelper;
        var mouseClickPos = this._mouseClickPos.overwriteWith(inputHelper.mouseClickPos);
        var camera = this.camera();
        var rayFromCameraThroughClick = new Ray(camera.loc.pos, camera.coordsTransformViewToWorld(mouseClickPos, true // ignoreZ
        ).subtract(camera.loc.pos).normalize());
        var bodiesClickedAsCollisions = CollisionExtended.rayAndEntitiesCollidable(rayFromCameraThroughClick, this.entities, [] // listToAddTo
        );
        var bodyClicked;
        if (bodiesClickedAsCollisions.length == 0) {
            bodyClicked = null;
        }
        else {
            var bodiesClickedAsCollisionsSorted = new Array();
            for (var i = 0; i < bodiesClickedAsCollisions.length; i++) {
                var collisionToSort = bodiesClickedAsCollisions[i];
                var j = 0;
                for (j = 0; j < bodiesClickedAsCollisionsSorted.length; j++) {
                    var collisionSorted = bodiesClickedAsCollisionsSorted[j];
                    if (collisionToSort.distanceToCollision < collisionSorted.distanceToCollision) {
                        break;
                    }
                }
                ArrayHelper.insertElementAt(bodiesClickedAsCollisionsSorted, collisionToSort, j);
            }
            var numberOfCollisions = bodiesClickedAsCollisionsSorted.length;
            var entitySelected = this.entitySelected();
            if (entitySelected == null || numberOfCollisions == 1) {
                bodyClicked = bodiesClickedAsCollisionsSorted[0].colliders[0];
            }
            else {
                for (var c = 0; c < numberOfCollisions; c++) {
                    var collision = bodiesClickedAsCollisionsSorted[c];
                    bodyClicked = collision.colliders[0];
                    if (bodyClicked == entitySelected) {
                        var cNext = c + 1;
                        if (cNext >= numberOfCollisions) {
                            cNext = 0;
                        }
                        collision = bodiesClickedAsCollisionsSorted[cNext];
                        bodyClicked = collision.colliders[0];
                        break;
                    }
                }
            }
            inputHelper.mouseClickedSet(false);
        }
        this.updateForTimerTick_Input_Mouse_Selection(universe, bodyClicked);
    }
    updateForTimerTick_Input_Mouse_Selection(universe, entityClicked) {
        var entitySelected = this.entitySelected();
        var selectionTypeName = (entitySelected == null
            ? null
            : entitySelected.constructor.name);
        if (entitySelected == null) {
            this.entitySelect(entityClicked);
        }
        else if (selectionTypeName == Planet.name) {
            this.updateForTimerTick_Input_Mouse_Selection_Planet(universe, entityClicked);
        }
        else if (selectionTypeName == Ship.name) {
            this.updateForTimerTick_Input_Mouse_Selection_Ship(universe, entityClicked);
        }
        else {
            this.entitySelect(entityClicked);
        }
    }
    updateForTimerTick_Input_Mouse_Selection_Planet(universe, bodyClicked) {
        var planetSelected = this.entitySelected();
        if (bodyClicked == null) {
            this.entitySelect(null);
        }
        else if (bodyClicked == planetSelected) {
            var detailsAreViewable = this.entitySelectedDetailsAreViewable(universe);
            if (detailsAreViewable) {
                var layout = planetSelected.layout(universe);
                var venueNext = new VenueLayout(this, bodyClicked, layout);
                universe.venueTransitionTo(venueNext);
            }
        }
        else if (planetSelected.isAwaitingTarget()) {
            // todo
        }
        else {
            this.entitySelect(bodyClicked);
        }
    }
    updateForTimerTick_Input_Mouse_Selection_Ship(universe, entityClicked) {
        var inputHelper = universe.inputHelper;
        var entityOrderable = this.entitySelected();
        var orderable = Orderable.fromEntity(entityOrderable);
        var order = orderable.order(entityOrderable);
        var entityTarget;
        var isAwaitingTarget = order.isAwaitingTarget();
        if (isAwaitingTarget == false) {
            // Just select the other entity.
            this.entitySelect(entityClicked);
        }
        else if (entityClicked != null) {
            // Targeting an existing body, not an arbitrary point.
            universe.inputHelper.pause(); // While the action plays out.
            entityTarget = entityClicked;
        }
        else if (this.cursor.hasXYPositionBeenSpecified == false) {
            this.cursor.hasXYPositionBeenSpecified = true;
        }
        else if (this.cursor.hasZPositionBeenSpecified == false) {
            this.cursor.hasZPositionBeenSpecified = true; // About to be cleared, though.
            inputHelper.unpause(); // Should we wait longer?
            var targetPos = Coords.create();
            entityTarget = new Entity("Target", [
                new BodyDefn("MoveTarget", targetPos, null),
                this.cursor.locatable().clone()
            ]);
        }
        else {
            throw new Error("Unexpected state!");
        }
        if (entityTarget != null) {
            var uwpe = new UniverseWorldPlaceEntities(universe, universe.world, this.starsystem, entityOrderable, entityTarget);
            order.entityBeingTargetedSet(entityTarget);
            order.obey(uwpe);
            this.cursor.clear();
        }
        inputHelper.mouseClickedSet(false); // hack
    }
    updateForTimerTick_Input_MouseMove(universe) {
        var inputHelper = universe.inputHelper;
        var mouseMovePos = this._mouseClickPos.overwriteWith(inputHelper.mouseMovePos);
        var camera = this.camera();
        var cameraPos = camera.loc.pos;
        var rayFromCameraThroughMouse = new Ray(cameraPos, camera.coordsTransformViewToWorld(mouseMovePos, true // ignoreZ
        ).subtract(cameraPos).normalize());
        var bodiesUnderMouseAsCollisions = CollisionExtended.rayAndEntitiesCollidable(rayFromCameraThroughMouse, this.entities, []);
        var bodyUnderMouse;
        if (bodiesUnderMouseAsCollisions.length == 0) {
            bodyUnderMouse = null;
        }
        else {
            bodiesUnderMouseAsCollisions = bodiesUnderMouseAsCollisions.sort((x) => x.distanceToCollision);
            bodyUnderMouse = bodiesUnderMouseAsCollisions[0].colliders[0];
        }
        this.cursor.entityUnderneath = bodyUnderMouse;
    }
    // camera
    camera() {
        return this.cameraEntity.camera();
    }
    cameraCenterOnSelection() {
        var entitySelected = this.entitySelected();
        if (entitySelected != null) {
            var constraint = this.cameraEntity.constrainable().constraintByClassName(Constraint_PositionOnCylinder.name);
            var constraintPosition = constraint;
            var selectionPos = entitySelected.locatable().loc.pos;
            constraintPosition.center.overwriteWith(selectionPos);
        }
    }
    cameraDown(cameraSpeed) {
        new Action_CylinderMove_DistanceAlongAxis(cameraSpeed).perform(this.cameraEntity);
    }
    cameraIn(cameraSpeed) {
        new Action_CylinderMove_Radius(0 - cameraSpeed).perform(this.cameraEntity);
    }
    cameraLeft(cameraSpeed) {
        new Action_CylinderMove_Yaw(cameraSpeed / 1000).perform(this.cameraEntity);
    }
    cameraOut(cameraSpeed) {
        new Action_CylinderMove_Radius(cameraSpeed).perform(this.cameraEntity);
    }
    cameraReset() {
        new Action_CylinderMove_Reset().perform(this.cameraEntity);
    }
    cameraRight(cameraSpeed) {
        new Action_CylinderMove_Yaw(0 - cameraSpeed / 1000).perform(this.cameraEntity);
    }
    cameraUp(cameraSpeed) {
        new Action_CylinderMove_DistanceAlongAxis(0 - cameraSpeed).perform(this.cameraEntity);
    }
    // controls
    toControl(universe) {
        var display = universe.display;
        var containerMainSize = display.sizeInPixels.clone();
        var margin = containerMainSize.x / 60;
        var controlHeight = margin * 1.5;
        var containerInnerSize = containerMainSize.clone().divide(Coords.fromXY(6, 10));
        var buttonWidth = (containerInnerSize.x - margin * 3) / 2;
        var fontHeightInPixels = margin;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var controlBuilder = universe.controlBuilder;
        var buttonBack = ControlButton.from5(Coords.fromXY((containerMainSize.x - buttonWidth) / 2, containerMainSize.y - margin - controlHeight), // pos
        Coords.fromXY(buttonWidth, controlHeight), // size
        "Back", fontNameAndHeight, () => // click
         {
            var venue = universe.venueCurrent();
            var venueNext = venue.venueParent;
            universe.venueTransitionTo(venueNext);
        });
        var containerTimeAndPlace = this.starsystem.controlBuildTimeAndPlace(universe, containerMainSize, containerInnerSize, margin, controlHeight);
        var containerViewSize = containerMainSize.clone().divideScalar(6);
        var containerView = controlBuilder.view(universe, containerMainSize, containerViewSize, margin, 10 // cameraSpeed
        );
        var containerSelectionSize = Coords.fromXY(containerInnerSize.x * 1.5, containerMainSize.y / 2);
        var containerMoveRepeatOrPassSize = Coords.fromXY(containerInnerSize.x, margin * 3);
        var containerPlanetsLinksAndShipsSize = Coords.fromXY(containerInnerSize.x, containerMainSize.y
            - margin * 4
            - containerSelectionSize.y
            - containerMoveRepeatOrPassSize.y);
        var containerMoveRepeatOrPass = this.starsystem.controlBuildMoveRepeatOrPass(universe, Coords.fromXY(containerMainSize.x - margin - containerMoveRepeatOrPassSize.x, margin * 2 + containerPlanetsLinksAndShipsSize.y), containerMoveRepeatOrPassSize, margin, controlHeight, this);
        var containerPlanetsLinksAndShips = this.starsystem.controlBuildPlanetsLinksAndShips(universe, Coords.fromXY(containerMainSize.x - margin - containerPlanetsLinksAndShipsSize.x, margin), // pos
        containerPlanetsLinksAndShipsSize, margin, controlHeight, this);
        var containerSelection = controlBuilder.selection(universe, Coords.fromXY(containerMainSize.x - margin - containerSelectionSize.x, margin * 3
            + containerPlanetsLinksAndShipsSize.y
            + containerMoveRepeatOrPassSize.y), // pos
        containerSelectionSize, margin);
        var containerMain = ControlContainer.from4("containerStarsystem", Coords.fromXY(0, 0), // pos
        containerMainSize, 
        // children
        [
            buttonBack,
            containerTimeAndPlace,
            containerView,
            containerPlanetsLinksAndShips,
            containerSelection,
            containerMoveRepeatOrPass,
        ]);
        var returnValue = new ControlContainerTransparent(containerMain);
        return returnValue;
    }
}
