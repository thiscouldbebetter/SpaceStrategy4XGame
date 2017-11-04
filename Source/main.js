function main()
{
	localStorage.clear(); 

	var displaySizeInPixels = new Coords(400, 300, 1);
	
	var display = new Display
	(
		[ displaySizeInPixels ],
		"Font", // fontName
		10, // fontHeightInPixels
		"Gray", "White" // colorFore, colorBack
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

	var universe0 = Universe.new(null);

	Globals.prototype.initialize
	(
		"Space Strategy 4X",
		20, // timerTicksPerSecond
		display,
		mediaLibrary,
		new ControlBuilder([ControlStyle.Instances.Default]),
		universe0
	);
}
