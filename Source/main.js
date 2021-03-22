"use strict";
function main() {
    //localStorage.clear();
    var displaySizeInPixels = new Coords(400, 300, 1);
    var display = new Display2D([displaySizeInPixels], "Font", // fontName
    10, // fontHeightInPixels
    "Blue", "rgb(16, 0, 32)", // colorFore, colorBack
    null // ?
    );
    var contentPath = "../Content/";
    var contentPathImages = contentPath + "Images/";
    var contentPathAudio = contentPath + "Audio/";
    var contentPathVideo = contentPath + "Video/";
    var contentPathFonts = contentPath + "Fonts/";
    var mediaLibrary = new MediaLibrary(
    // images
    [
        new Image2("Opening", contentPathImages + "Opening.png"),
        new Image2("Title", contentPathImages + "Title.png"),
    ], 
    // sounds
    [
        new Sound("Sound", contentPathAudio + "Effects/Sound.wav"),
        new Sound("Music_Title", contentPathAudio + "Music/Music.mp3"),
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
    []);
    var controlBuilder = new ControlBuilderExtended();
    var universe = Universe.create("Space_Strategy_4X", "0.0.0-20210321-2030", new TimerHelper(20), display, mediaLibrary, controlBuilder, (universe) => WorldExtended.create(universe));
    universe.initialize((x) => { x.start(); });
}
