function main()
{
	//localStorage.clear(); 

	var viewSize = new Coords(400, 300, 1);

	var universe0 = Universe.new(null);

	var applicationName = "Fretwork";

	Globals.prototype.initialize
	(
		applicationName,
		50, // millisecondsPerTimerTick
		viewSize,
		universe0,
		// sounds
		[
			new Sound("Sound", "Sound.wav"),
			new Sound("Music", "Music.mp3"),
		],
		// videos
		[
			new Video("Intro", "Movie.webm"),
		]
	);
}
