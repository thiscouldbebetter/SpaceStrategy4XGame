"use strict";
class EnvironmentMock {
    universeBuild() {
        var timerHelper = new TimerHelper(0);
        var display = DisplayTest.default();
        var soundHelper = new SoundHelperMock();
        var mediaLibrary = MediaLibrary.default();
        var controlBuilder = new ControlBuilderExtended(ControlBuilder.default());
        var worldCreatorSettings = {
            "starsystemCount": 12,
            "factionCount": 2,
            "isValid": (worldCreator) => {
                var settings = worldCreator.settings;
                var areAllSettingsValid = (isNaN(settings.starsystemCount) == false
                    && isNaN(settings.factionCount) == false);
                return areAllSettingsValid;
            }
        };
        var worldCreator = new WorldCreator((universe, worldCreator) => {
            return new WorldExtendedCreator(universe, worldCreator).create();
        }, (universe, worldCreator) => {
            return worldCreatorToControl(universe, worldCreator);
        }, worldCreatorSettings);
        var universe = new Universe("TestUniverse", "[version]", timerHelper, display, soundHelper, mediaLibrary, controlBuilder, worldCreator);
        universe.initialize(() => { });
        universe.soundHelper = new SoundHelperMock();
        var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);
        universe.worldCreate().initialize(uwpe);
        universe.updateForTimerTick();
        return universe;
    }
}
