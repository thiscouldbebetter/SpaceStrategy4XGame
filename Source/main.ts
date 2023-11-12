function main()
{
	//localStorage.clear();

	var displaySizeInPixels = new Coords(800, 600, 1);

	var display = new Display2D
	(
		[ displaySizeInPixels ],
		new FontNameAndHeight("Font", 10),
		Color.byName("Blue"),
		Color.fromSystemColor("rgb(16, 0, 32)"), // colorFore, colorBack
		null // ?
	);

	var contentPath = "../Content/";
	var contentPathImages = contentPath + "Images/";
	var contentPathAudio = contentPath + "Audio/";
	var contentPathVideo = contentPath + "Video/";
	var contentPathFonts = contentPath + "Fonts/";
	var contentPathTextStrings = contentPath + "Text/";

	var mediaLibrary = new MediaLibrary
	(
		"", // contentDirectoryPath - Already incorporated into item paths?

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
			new TextString("Diplomacy_Others_Default", 		contentPathTextStrings + "Diplomacy/Others/Default.json"),
			new TextString("Diplomacy_Others_Chivalrous",	contentPathTextStrings + "Diplomacy/Others/Chivalrous.json"),
			new TextString("Diplomacy_Others_Enthusiastic",	contentPathTextStrings + "Diplomacy/Others/Enthusiastic.json"),
			new TextString("Diplomacy_Others_Haughty",		contentPathTextStrings + "Diplomacy/Others/Haughty.json"),
			new TextString("Diplomacy_Others_Poetic",		contentPathTextStrings + "Diplomacy/Others/Poetic.json"),
			new TextString("Diplomacy_Others_Robotic",		contentPathTextStrings + "Diplomacy/Others/Robotic.json"),
			new TextString("Diplomacy_Others_Unctuous",		contentPathTextStrings + "Diplomacy/Others/Unctuous.json"),
			new TextString("Diplomacy_Others_Unhinged",		contentPathTextStrings + "Diplomacy/Others/Unhinged.json"),

			new TextString("Diplomacy_Player_Default", contentPathTextStrings + "Diplomacy/Player/Default.json"),
		]
	);

	var controlBuilder = new ControlBuilderExtended();

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
			return WorldExtended.create(universe, worldCreator)
		},
		(universe, worldCreator) =>
		{
			return worldCreatorToControl(universe, worldCreator)
		},
		worldCreatorSettings
	);

	var universe = Universe.create
	(
		"Space_Strategy_4X",
		"0.0.0-2021-12-12",
		new TimerHelper(20),
		display,
		mediaLibrary,
		controlBuilder,
		worldCreator
	);
	universe.initialize( (x: any) => { x.start() });
}

function worldCreatorToControl
(
	universe: Universe, worldCreator: WorldCreator
): ControlBase
{
	var size = universe.display.sizeInPixels;
	var margin = 8;
	var fontHeightInPixels = 10;
	var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
	var controlHeight = fontHeightInPixels + margin;
	var buttonSize =
		Coords.fromXY(4, 1).multiplyScalar(controlHeight);

	var returnControl = ControlContainer.from4
	(
		"containerWorldCreator",
		Coords.zeroes(), // pos
		size,
		[
			new ControlLabel
			(
				"labelWorldCreationSettings",
				Coords.fromXY(margin, margin), // pos
				Coords.fromXY(size.x - margin * 2, controlHeight),
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext("World Creation Settings"),
				fontNameAndHeight
			),

			new ControlLabel
			(
				"labelWorldStarsystemCount",
				Coords.fromXY(margin, margin * 2 + controlHeight), // pos
				Coords.fromXY(size.x - margin * 2, controlHeight),
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext("Starsystems:"),
				fontNameAndHeight
			),

			new ControlNumber
			(
				"numberStarsystemCount",
				Coords.fromXY(margin * 8, margin * 2 + controlHeight), // pos
				Coords.fromXY(controlHeight * 2, controlHeight), // size
				new DataBinding
				(
					worldCreator,
					(c: WorldCreator) => c.settings.starsystemCount,
					(c: WorldCreator, v: number) => c.settings.starsystemCount = v
				), // value
				DataBinding.fromGet( (c: WorldCreator) => 12), // valueMin
				DataBinding.fromGet( (c: WorldCreator) => 128), // valueMax
				fontNameAndHeight,
				DataBinding.fromTrue() // isEnabled
			),

			new ControlLabel
			(
				"labelWorldFactionCount",
				Coords.fromXY(margin, margin * 3 + controlHeight * 2), // pos
				Coords.fromXY(size.x - margin * 2, controlHeight),
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext("Factions:"),
				fontNameAndHeight
			),

			new ControlNumber
			(
				"numberFactionCount",
				Coords.fromXY(margin * 8, margin * 3 + controlHeight * 2), // pos
				Coords.fromXY(controlHeight * 2, controlHeight), // size
				new DataBinding
				(
					worldCreator,
					(c: WorldCreator) => c.settings.factionCount,
					(c: WorldCreator, v: number) => c.settings.factionCount = v
				), // value
				DataBinding.fromGet( (c: WorldCreator) => 2), // valueMin
				DataBinding.fromGet( (c: WorldCreator) => 7), // valueMax
				fontNameAndHeight,
				DataBinding.fromTrue() // isEnabled
			),

			new ControlButton
			(
				"buttonCreate",
				Coords.fromXY
				(
					size.x - margin - buttonSize.x,
					size.y - margin - buttonSize.y
				),
				buttonSize,
				"Create",
				fontNameAndHeight,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					worldCreator,
					(wc: WorldCreator) => wc.settings.isValid(worldCreator)
				), // isEnabled
				() =>
					universe.venueTransitionTo
					(
						worldCreator.venueWorldGenerate(universe)
					),
				false // canBeHeldDown
			)
		]
	);

	return returnControl;
}

