
class SoundHelperMock implements SoundHelper
{
	audioContext(): AudioContext { return null; }
	controlSelectOptionsVolume(): ControlSelectOption<number>[]  { return null; }
	initialize(): number { return 0; }
	musicVolume: number;
	reset(): void {}
	soundForMusic: Sound;
	soundVolume: number;
	soundWithNamePlayAsEffect(universe: Universe, soundName: string): void {}
	soundWithNamePlayAsMusic(universe: Universe, soundName: string): void {}
	soundsAllStop(universe: Universe): void {}
}
