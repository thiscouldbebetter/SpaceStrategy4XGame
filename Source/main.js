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
	
	var mediaLibrary = new MediaLibrary
	(
		// images
		[
			new Image("Title", "../Media/Title.png"),
		],
		// sounds
		[
			new Sound("Sound", "../Media/Sound.wav", false),
			new Sound("Music", "../Media/Music.mp3", true),
		],
		// videos
		[
			new Video("Movie", "../Media/Movie.webm"),
		],
		// fonts
		[
			new Font("Font", "../Media/Font.ttf")
		],
	);

	var controlStyle = new ControlStyle
	(
		"Default", // name
		"rgb(60, 60, 240)", // colorBackground
		"rgb(30, 30, 120)", // colorFill
		"rgb(180, 180, 240)", // colorBorder
		"LightGray" // colorDisabled
	);
	
	var universe = Universe.new
	(
		"Space_Strategy_4X", new TimerHelper(20), display, mediaLibrary, null
	);
	universe.initialize();
	
}
