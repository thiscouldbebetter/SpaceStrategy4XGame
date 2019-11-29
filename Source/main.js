function main()
{
	//localStorage.clear();

	var displaySizeInPixels = new Coords(400, 300, 1);

	var display = new Display
	(
		[ displaySizeInPixels ],
		"Font", // fontName
		10, // fontHeightInPixels
		"Blue", "rgb(16, 0, 32)" // colorFore, colorBack
	);
	
	var contentPath = "../Content/";
	var contentPathImages = contentPath + "Images/";
	var contentPathAudio = contentPath + "Audio/";
	var contentPathVideo = contentPath + "Video/";
	var contentPathFonts = contentPath + "Fonts/";

	var mediaLibrary = new MediaLibrary
	(
		// images
		[
			new Image("Title", contentPathImages + "Title.png"),
		],
		// sounds
		[
			new Sound("Sound", contentPathAudio + "Effects/Sound.wav", false),
			new Sound("Music", contentPathAudio + "Music/Music.mp3", true),
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
		[]
	);

	var universe = Universe.new
	(
		"Space_Strategy_4X",
		"0.0.0-20191129-1200",
		new TimerHelper(20),
		display,
		mediaLibrary,
		null // world
	);
	universe.initialize();

	// hack
	var controlStyle = new ControlStyle
	(
		"Default", // name
		"rgb(60, 60, 240)", // colorBackground
		"rgb(30, 30, 120)", // colorFill
		"rgb(180, 180, 240)", // colorBorder
		"LightGray" // colorDisabled
	);
	//universe.controlBuilder = new ControlBuilder([controlStyle]);

}
