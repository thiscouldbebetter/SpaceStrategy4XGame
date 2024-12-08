
class EnvironmentMock
{
	universeBuild(): Universe
	{
		var timerHelper = new TimerHelper(0);
		var display = DisplayTest.default();
		var soundHelper = new SoundHelperMock();
		var mediaLibrary = this.mediaLibraryBuild();
		var controlBuilder = new ControlBuilderExtended(ControlBuilder.default() );

		var worldCreatorSettings =
		{
			"starsystemCount": 12,
			"factionCount": 2,

			"isValid": (worldCreator: WorldCreator) =>
			{
				var settings = worldCreator.settings;
				var areAllSettingsValid =
				(
					isNaN(settings.starsystemCount) == false
					&& isNaN(settings.factionCount) == false
				)
				return areAllSettingsValid;
			}
		};

		var worldCreator = new WorldCreator
		(
			(universe, worldCreator) =>
			{
				return new WorldExtendedCreator(universe, worldCreator).create();
			},
			(universe, worldCreator) =>
			{
				return worldCreatorToControl(universe, worldCreator)
			},
			worldCreatorSettings
		);

		var universe = new Universe
		(
			"TestUniverse",
			"[version]",
			timerHelper,
			display,
			soundHelper,
			mediaLibrary,
			controlBuilder,
			worldCreator
		);

		universe.initialize(() => {});
		universe.soundHelper = new SoundHelperMock();

		var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);
		universe.worldCreate().initialize(uwpe);
		universe.updateForTimerTick();

		return universe;
	}

	mediaLibraryBuild(): MediaLibrary
	{
		var contentPath = "../Content/";
		var contentPathImages = contentPath + "Images/";
		var contentPathImagesTitles = contentPathImages + "Titles/";
		//var contentPathAudio = contentPath + "Audio/";
		var contentPathVideo = contentPath + "Video/";
		var contentPathFonts = contentPath + "Fonts/";

		var mediaLibrary = new MediaLibrary
		(
			"", // contentDirectoryPath - Already incorporated into item paths?

			// images
			[
				new Image2("Titles_Opening", contentPathImagesTitles + "Opening.png"),
				new Image2("Titles_Producer", contentPathImagesTitles + "Producer.png"),
				new Image2("Titles_Title", contentPathImagesTitles + "Title.png"),
			],
			// sounds
			[
				/*
				new SoundFromFile("Music_Title", contentPathAudio + "Music/Music.mp3"),
				new SoundFromFile("Music_Producer", contentPathAudio + "Music/Producer.mp3"),
				new SoundFromFile("Sound", contentPathAudio + "Effects/Sine-440Hz-250ms-Fading.mp3"),
				*/
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
				/*
				TextString.fromString("Diplomacy_Others_Chivalrous",	ConversationStyleChivalrous.Content),
				TextString.fromString("Diplomacy_Others_Default", 		ConversationStyleDefault.Content),
				TextString.fromString("Diplomacy_Others_Enthusiastic",	ConversationStyleEnthusiastic.Content),
				TextString.fromString("Diplomacy_Others_Formal",		ConversationStyleFormal.Content),
				TextString.fromString("Diplomacy_Others_Haughty",		ConversationStyleHaughty.Content),
				TextString.fromString("Diplomacy_Others_Mercantile",	ConversationStyleMercantile.Content),
				TextString.fromString("Diplomacy_Others_Mercenary",		ConversationStyleMercenary.Content),
				TextString.fromString("Diplomacy_Others_Monoverbal",	ConversationStyleMonoverbal.Content),
				TextString.fromString("Diplomacy_Others_Morose",		ConversationStyleMorose.Content),
				TextString.fromString("Diplomacy_Others_Poetic",		ConversationStylePoetic.Content),
				TextString.fromString("Diplomacy_Others_Prospector",	ConversationStyleProspector.Content),
				TextString.fromString("Diplomacy_Others_Robotic",		ConversationStyleRobotic.Content),
				TextString.fromString("Diplomacy_Others_Unctuous",		ConversationStyleUnctuous.Content),
				TextString.fromString("Diplomacy_Others_Unhinged",		ConversationStyleUnhinged.Content),
				TextString.fromString("Diplomacy_Others_Untranslatable",ConversationStyleUntranslatable.Content),

				TextString.fromString("Diplomacy_Player_Default", 		ConversationStylePlayer.Content),
				*/
			]
		);

		return mediaLibrary;
	}
}
