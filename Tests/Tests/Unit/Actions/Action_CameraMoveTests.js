"use strict";
class Action_CameraMoveTests extends TestFixture {
    constructor() {
        super(Action_CameraMoveTests.name);
    }
    tests() {
        return [this.perform];
    }
    perform() {
        var camera = Camera.default();
        var displacementsRightDown = [0, 0];
        var action = new Action_CameraMove(displacementsRightDown);
        action.perform(camera);
    }
}
