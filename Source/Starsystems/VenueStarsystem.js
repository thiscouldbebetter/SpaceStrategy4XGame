"use strict";
class VenueStarsystem {
    constructor(venueParent, starsystem) {
        this.venueParent = venueParent;
        this.starsystem = starsystem;
        this.cursor = new Cursor();
        this._mouseClickPos = Coords.create();
    }
    draw(universe) {
        var world = universe.world;
        var display = universe.display;
        display.drawBackground(null, null);
        var uwpe = new UniverseWorldPlaceEntities(universe, world, null, null, null);
        this.starsystem.draw(uwpe, display);
        this.cursor.draw(uwpe, display);
        this.venueControls.draw(universe);
    }
    finalize(universe) {
        universe.soundHelper.soundForMusic.pause(universe);
    }
    initialize(universe) {
        var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);
        this.venueControls = this.toControl(universe).toVenue();
        var starsystem = this.starsystem;
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
    }
    model() {
        return this.starsystem;
    }
    selectionName() {
        return (this.selection == null ? "[none]" : this.selection.name);
    }
    updateForTimerTick(universe) {
        this.venueControls.updateForTimerTick(universe);
        var uwpe = new UniverseWorldPlaceEntities(universe, universe.world, null, null, null);
        this.cameraEntity.constrainable().constrain(uwpe.entitySet(this.cameraEntity));
        if (this.cursor != null) {
            this.cursor.constrainable().constrain(uwpe.entitySet(this.cursor));
        }
        var ships = this.starsystem.ships;
        for (var i = 0; i < ships.length; i++) {
            var ship = ships[i];
            var activity = ship.actor().activity;
            if (activity != null) {
                activity.perform(uwpe.entitySet(ship));
            }
        }
        this.draw(universe);
        this.updateForTimerTick_Input(universe);
    }
    updateForTimerTick_Input(universe) {
        var cameraSpeed = 10;
        var inputHelper = universe.inputHelper;
        var inputsActive = inputHelper.inputsPressed;
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
            else if (inputHelper.isMouseClicked(null)) {
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
        ).subtract(camera.loc.pos));
        var bodiesClickedAsCollisions = CollisionExtended.rayAndBodies(rayFromCameraThroughClick, this.entities, 10, // bodyRadius
        []);
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
            if (this.selection == null || numberOfCollisions == 1) {
                bodyClicked = bodiesClickedAsCollisionsSorted[0].colliders[0];
            }
            else {
                for (var c = 0; c < numberOfCollisions; c++) {
                    var collision = bodiesClickedAsCollisionsSorted[c];
                    bodyClicked = collision.colliders[0];
                    if (bodyClicked == this.selection) {
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
        }
        this.updateForTimerTick_Input_Mouse_Selection(universe, bodyClicked);
        inputHelper.isMouseClicked(false);
    }
    updateForTimerTick_Input_Mouse_Selection(universe, bodyClicked) {
        var selectionTypeName = (this.selection == null ? null : this.selection.constructor.name);
        // todo - Fix.
        if (this.selection == null) {
            this.selection = bodyClicked;
        }
        else if (selectionTypeName == Ship.name) {
            var ship = this.selection;
            if (bodyClicked != null) // && bodyClicked.defn.name != "Cursor")
             {
                // Targeting an existing body, not an arbitrary point.
                universe.inputHelper.isEnabled = false;
                var targetEntity = bodyClicked;
                if (this.cursor.orderName != null) {
                    var order = new Order(this.cursor.orderName, targetEntity);
                    ship.orderSet(order);
                    order.obey(universe, universe.world, null, ship);
                }
                this.cursor.clear();
            }
            else if (this.cursor.hasXYPositionBeenSpecified == false) {
                this.cursor.hasXYPositionBeenSpecified = true;
            }
            else if (this.cursor.hasZPositionBeenSpecified == false) {
                universe.inputHelper.isEnabled = false;
                var targetPos = Coords.create();
                var target = new Entity("Target", [
                    new BodyDefn("MoveTarget", targetPos, null),
                    this.cursor.locatable().clone()
                ]);
                var order = new Order(this.cursor.orderName, target);
                Orderable.fromEntity(ship).order = order;
                order.obey(universe, universe.world, null, ship);
                this.cursor.clear();
            }
        }
        else if (selectionTypeName == Planet.name) {
            if (bodyClicked == this.selection) {
                var planet = bodyClicked;
                if (planet != null) {
                    var layout = planet.layout;
                    var venueNext = new VenueLayout(this, bodyClicked, layout);
                    venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
                }
            }
        }
        else {
            this.selection = bodyClicked;
        }
    }
    updateForTimerTick_Input_MouseMove(universe) {
        var inputHelper = universe.inputHelper;
        var mouseMovePos = this._mouseClickPos.overwriteWith(inputHelper.mouseMovePos);
        var camera = this.camera();
        var cameraPos = camera.loc.pos;
        var rayFromCameraThroughMouse = new Ray(cameraPos, camera.coordsTransformViewToWorld(mouseMovePos, true // ignoreZ
        ).subtract(cameraPos));
        var bodiesUnderMouseAsCollisions = CollisionExtended.rayAndBodies(rayFromCameraThroughMouse, this.entities, 10, // bodyRadius
        []);
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
        if (this.selection != null) {
            var constraint = this.cameraEntity.constrainable().constraintByClassName(Constraint_PositionOnCylinder.name);
            var constraintPosition = constraint;
            var selectionPos = this.selection.locatable().loc.pos;
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
        var fontHeightInPixels = display.fontHeightInPixels;
        var controlHeight = 16;
        var margin = 10;
        var containerInnerSize = Coords.fromXY(100, 60);
        var buttonWidth = (containerInnerSize.x - margin * 3) / 2;
        var controlBuilder = universe.controlBuilder;
        var container = ControlContainer.from4("containerStarsystem", Coords.fromXY(0, 0), // pos
        containerMainSize, 
        // children
        [
            ControlButton.from8("buttonBack", Coords.fromXY((containerMainSize.x - buttonWidth) / 2, containerMainSize.y - margin - controlHeight), // pos
            Coords.fromXY(buttonWidth, controlHeight), // size
            "Back", fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                var venue = universe.venueCurrent;
                var venueNext = venue.venueParent;
                venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                universe.venueNext = venueNext;
            }),
            controlBuilder.timeAndPlace(universe, containerMainSize, containerInnerSize, margin, controlHeight),
            controlBuilder.view(universe, containerMainSize, containerInnerSize, margin, controlHeight),
            controlBuilder.selection(universe, Coords.fromXY(containerMainSize.x - margin - containerInnerSize.x, margin), Coords.fromXY(containerInnerSize.x, containerMainSize.y - margin * 2), margin, controlHeight),
        ]);
        var returnValue = new ControlContainerTransparent(container);
        return returnValue;
    }
}
