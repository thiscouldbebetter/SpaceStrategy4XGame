function main()
{
	//localStorage.clear();

	var displaySizeInPixels = new Coords(400, 300, 1);

	var display = new Display2D
	(
		[ displaySizeInPixels ],
		"Font", // fontName
		10, // fontHeightInPixels
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
		// images
		[
			new Image2("Opening", contentPathImages + "Opening.png"),
			new Image2("Producer", contentPathImages + "Producer.png"),
			new Image2("Title", contentPathImages + "Title.png"),
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
			new TextString("Diplomacy", contentPathTextStrings + "Diplomacy.json")
		]
	);

	var controlBuilder = new ControlBuilderExtended();

	var worldCreatorSettings =
	{
		"starsystemCountAsString": "12",
		"factionCountAsString": "2",

		"isValid": (worldCreator: WorldCreator) =>
		{
			var settings = worldCreator.settings;
			var areAllSettingsValid =
			(
				isNaN(settings.starsystemCountAsString) == false
				&& isNaN(settings.factionCountAsString) == false
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
				false, // isTextCentered
				DataBinding.fromContext("World Creation Settings"),
				fontHeightInPixels
			),

			new ControlLabel
			(
				"labelWorldStarsystemCount",
				Coords.fromXY(margin, margin * 2 + controlHeight), // pos
				Coords.fromXY(size.x - margin * 2, controlHeight),
				false, // isTextCentered
				DataBinding.fromContext("Starsystems:"),
				fontHeightInPixels
			),

			new ControlTextBox
			(
				"textBoxStarsystemCount",
				Coords.fromXY(margin * 8, margin * 2 + controlHeight), // pos
				Coords.fromXY(controlHeight * 2, controlHeight), // size
				new DataBinding
				(
					worldCreator,
					(c: WorldCreator) => c.settings.starsystemCountAsString,
					(c: WorldCreator, v: string) => c.settings.starsystemCountAsString = v
				), // text
				fontHeightInPixels,
				3, // charCountMax
				DataBinding.fromTrue() // isEnabled
			),

			new ControlLabel
			(
				"labelWorldFactionCount",
				Coords.fromXY(margin, margin * 3 + controlHeight * 2), // pos
				Coords.fromXY(size.x - margin * 2, controlHeight),
				false, // isTextCentered
				DataBinding.fromContext("Factions:"),
				fontHeightInPixels
			),

			new ControlTextBox
			(
				"textBoxFactionCount",
				Coords.fromXY(margin * 8, margin * 3 + controlHeight * 2), // pos
				Coords.fromXY(controlHeight * 2, controlHeight), // size
				new DataBinding
				(
					worldCreator,
					(c: WorldCreator) => c.settings.factionCountAsString,
					(c: WorldCreator, v: string) => c.settings.factionCountAsString = v
				), // text
				fontHeightInPixels,
				64, // charCountMax
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
				fontHeightInPixels,
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

