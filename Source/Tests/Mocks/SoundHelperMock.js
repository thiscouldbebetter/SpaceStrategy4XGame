"use strict";
class SoundHelperMock {
    audioContext() { return null; }
    controlSelectOptionsVolume() { return null; }
    initialize() { return 0; }
    reset() { }
    soundForMusicPause() { }
    soundWithName(universe, name) {
        return null;
    }
    soundWithNamePlayAsEffect(universe, soundName) { }
    soundWithNamePlayAsMusic(universe, soundName) { }
    soundWithNameStop(name) { }
    soundsAllStop(universe) { }
}
