"use strict";
class EnvironmentMock {
    universeBuild() {
        var timerHelper = new TimerHelper(0);
        var display = DisplayTest.default();
        var mediaLibrary = MediaLibrary.default();
        var controlBuilder = ControlBuilder.default();
        var universe = new Universe("TestUniverse", "[version]", timerHelper, display, mediaLibrary, controlBuilder, (u) => WorldExtended.create(u));
        universe.initialize(() => { });
        universe.worldCreate().initialize(universe);
        return universe;
    }
}
