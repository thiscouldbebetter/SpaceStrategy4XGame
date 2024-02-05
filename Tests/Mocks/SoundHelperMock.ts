
class SoundHelperMock implements SoundHelper
{
	audioContext(): AudioContext { return null; }
	controlSelectOptionsVolume(): ControlSelectOption<number>[]  { return null; }
	effectVolume: number
	initialize(): number { return 0; }
	musicVolume: number;
	reset(): void {}
	soundForMusic: Sound;
	soundForMusicPause(): void {}
	soundVolume: number;
	soundWithNamePlayAsEffect(universe: Universe, soundName: string): void {}
	soundWithNamePlayAsMusic(universe: Universe, soundName: string): void {}
	soundWithNameStop(name: string): void {}
	soundsAllStop(universe: Universe): void {}
}
