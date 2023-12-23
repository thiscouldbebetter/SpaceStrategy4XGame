"use strict";
function main() {
    //localStorage.clear();
    var displaySizeInPixels = new Coords(800, 600, 1);
    var display = new Display2D([displaySizeInPixels], new FontNameAndHeight("Font", 10), Color.byName("Blue"), Color.fromSystemColor("rgb(16, 0, 32)"), // colorFore, colorBack
    null // ?
    );
    var contentPath = "../Content/";
    var contentPathImages = contentPath + "Images/";
    var contentPathAudio = contentPath + "Audio/";
    var contentPathVideo = contentPath + "Video/";
    var contentPathFonts = contentPath + "Fonts/";
    // var contentPathTextStrings = contentPath + "Text/";
    var mediaLibrary = new MediaLibrary("", // contentDirectoryPath - Already incorporated into item paths?
    // images
    [
        new Image2("Titles_Opening", contentPathImages + "Opening.png"),
        new Image2("Titles_Producer", contentPathImages + "Producer.png"),
        new Image2("Titles_Title", contentPathImages + "Title.png"),
    ], 
    // sounds
    [
        new SoundFromFile("Music_Title", contentPathAudio + "Music/Music.mp3"),
        new SoundFromFile("Music_Producer", contentPathAudio + "Music/Producer.mp3"),
        new SoundFromFile("Sound", contentPathAudio + "Effects/Sound.wav"),
    ], 
    // videos
    [
        new Video("Movie", contentPathVideo + "Movie.webm"),
    ], 
    // fonts
    [
        new Font("Font", contentPathFonts + "Font.ttf")
    ], 
    // textStrings
    [
        TextString.fromString("Diplomacy_Others_Chivalrous", ConversationStyleChivalrous.Content),
        TextString.fromString("Diplomacy_Others_Default", ConversationStyleDefault.Content),
        TextString.fromString("Diplomacy_Others_Enthusiastic", ConversationStyleEnthusiastic.Content),
        TextString.fromString("Diplomacy_Others_Formal", ConversationStyleFormal.Content),
        TextString.fromString("Diplomacy_Others_Haughty", ConversationStyleHaughty.Content),
        TextString.fromString("Diplomacy_Others_Mercantile", ConversationStyleMercantile.Content),
        TextString.fromString("Diplomacy_Others_Mercenary", ConversationStyleMercenary.Content),
        TextString.fromString("Diplomacy_Others_Monoverbal", ConversationStyleMonoverbal.Content),
        TextString.fromString("Diplomacy_Others_Morose", ConversationStyleMorose.Content),
        TextString.fromString("Diplomacy_Others_Poetic", ConversationStylePoetic.Content),
        TextString.fromString("Diplomacy_Others_Prospector", ConversationStyleProspector.Content),
        TextString.fromString("Diplomacy_Others_Robotic", ConversationStyleRobotic.Content),
        TextString.fromString("Diplomacy_Others_Unctuous", ConversationStyleUnctuous.Content),
        TextString.fromString("Diplomacy_Others_Unhinged", ConversationStyleUnhinged.Content),
        TextString.fromString("Diplomacy_Others_Untranslatable", ConversationStyleUntranslatable.Content),
        TextString.fromString("Diplomacy_Player_Default", ConversationStylePlayer.Content),
    ]);
    var controlStyles = ControlStyle.Instances();
    var controlBuilderInner = ControlBuilder.fromStyle(controlStyles.DarkAndRounded);
    var controlBuilder = new ControlBuilderExtended(controlBuilderInner);
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
    var universe = Universe.create("Space_Strategy_4X", null, // version,
    new TimerHelper(20), display, mediaLibrary, controlBuilder, worldCreator);
    universe.initialize((x) => { x.start(); });
}
function worldCreatorToControl(universe, worldCreator) {
    var size = universe.display.sizeInPixels;
    var margin = size.x / 40;
    var marginAsCoords = Coords.fromXY(1, 1).multiplyScalar(margin);
    var sizeMinusMargins = size.clone().subtract(marginAsCoords).subtract(marginAsCoords);
    var fontHeightInPixels = margin;
    var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
    var controlHeight = fontHeightInPixels + margin;
    var buttonSize = Coords.fromXY(4, 1).multiplyScalar(controlHeight);
    var labelWorldCreationSettings = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin), // pos
    Coords.fromXY(size.x - margin * 2, controlHeight), DataBinding.fromContext("World Creation Settings"), fontNameAndHeight);
    var labelWorldStarsystemCount = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin * 2 + controlHeight), // pos
    Coords.fromXY(size.x - margin * 2, controlHeight), DataBinding.fromContext("Starsystems:"), fontNameAndHeight);
    var numberStarsystemCount = new ControlNumber("numberStarsystemCount", Coords.fromXY(margin * 8, margin * 2 + controlHeight), // pos
    Coords.fromXY(controlHeight * 2, controlHeight), // size
    new DataBinding(worldCreator, (c) => c.settings.starsystemCount, (c, v) => c.settings.starsystemCount = v), // value
    DataBinding.fromGet((c) => 12), // valueMin
    DataBinding.fromGet((c) => 128), // valueMax
    fontNameAndHeight, DataBinding.fromTrue() // isEnabled
    );
    var labelWorldFactionCount = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin * 3 + controlHeight * 2), // pos
    Coords.fromXY(size.x - margin * 2, controlHeight), DataBinding.fromContext("Factions:"), fontNameAndHeight);
    var numberFactionCount = new ControlNumber("numberFactionCount", Coords.fromXY(margin * 8, margin * 3 + controlHeight * 2), // pos
    Coords.fromXY(controlHeight * 2, controlHeight), // size
    new DataBinding(worldCreator, (c) => c.settings.factionCount, (c, v) => c.settings.factionCount = v), // value
    DataBinding.fromGet((c) => 2), // valueMin
    DataBinding.fromGet((c) => 7), // valueMax
    fontNameAndHeight, DataBinding.fromTrue() // isEnabled
    );
    var labelFactionType = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin * 4 + controlHeight * 3), // pos
    Coords.fromXY(size.x - margin * 2, controlHeight), DataBinding.fromContext("Player Faction:"), fontNameAndHeight);
    var selectFactionType = new ControlSelect("selectFactionType", Coords.fromXY(margin * 8, margin * 4 + controlHeight * 3), // pos
    Coords.fromXY(controlHeight * 3, controlHeight), // size
    new DataBinding(worldCreator, (c) => c.settings.factionDefnName, (c, v) => c.settings.factionDefnName = v), // valueSelected
    DataBinding.fromContextAndGet(worldCreator, (c) => FactionDefn.Instances()._All), // options
    DataBinding.fromGet((c) => c.name), // bindingForOptionValues,
    DataBinding.fromGet((c) => c.name), // bindingForOptionText
    fontNameAndHeight);
    var textSpecialAbility = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin * 5 + controlHeight * 4), // pos
    Coords.fromXY(sizeMinusMargins.x, controlHeight), // size
    DataBinding.fromContextAndGet(worldCreator, (c) => {
        var factionDefn = FactionDefn.byName(c.settings.factionDefnName);
        var abilityDescription = "";
        if (factionDefn == null) {
            abilityDescription = "-";
        }
        else {
            var ability = factionDefn.ability;
            var roundsToCharge = ability.roundsToCharge;
            var frequencyPrefix = roundsToCharge == null
                ? ""
                : "Every " + roundsToCharge + " rounds: ";
            abilityDescription = frequencyPrefix + ability.description;
        }
        return "Special Ability: " + abilityDescription;
    }), fontNameAndHeight);
    var labelFactionColor = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin * 6 + controlHeight * 5), // pos
    Coords.fromXY(size.x - margin * 2, controlHeight), DataBinding.fromContext("Player Color:"), fontNameAndHeight);
    var selectFactionColor = new ControlSelect("selectFactionColor", Coords.fromXY(margin * 8, margin * 6 + controlHeight * 5), // pos
    Coords.fromXY(controlHeight * 3, controlHeight), // size
    new DataBinding(worldCreator, (c) => c.settings.factionColor, (c, v) => c.settings.factionColor = v), // valueSelected
    DataBinding.fromContextAndGet(worldCreator, (c) => Faction.colors()), // options
    DataBinding.fromGet((c) => c), // bindingForOptionValues,
    DataBinding.fromGet((c) => c.name), // bindingForOptionText
    fontNameAndHeight);
    var buttonCreate = ControlButton.from11("buttonCreate", Coords.fromXY(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y), buttonSize, "Create", fontNameAndHeight, true, // hasBorder
    DataBinding.fromContextAndGet(worldCreator, (wc) => wc.settings.isValid(worldCreator)), // isEnabled
    () => universe.venueTransitionTo(worldCreator.venueWorldGenerate(universe)), false // canBeHeldDown
    );
    var returnControl = ControlContainer.from4("containerWorldCreator", Coords.zeroes(), // pos
    size, [
        labelWorldCreationSettings,
        labelWorldStarsystemCount,
        numberStarsystemCount,
        labelWorldFactionCount,
        numberFactionCount,
        labelFactionType,
        selectFactionType,
        textSpecialAbility,
        labelFactionColor,
        selectFactionColor,
        buttonCreate
    ]);
    return returnControl;
}
