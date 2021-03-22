
class Action_CameraMove
{
	displacementAmountsRightAndDown: number[];

	displacement: Coords;
	polar: Polar;

	constructor(displacementAmountsRightAndDown: number[])
	{
		this.displacementAmountsRightAndDown = displacementAmountsRightAndDown;
		this.displacement = Coords.create();
		this.polar = new Polar(0, 1, 0);
	}

	perform(camera: Camera)
	{
		var cameraLoc = camera.loc;
		var cameraOrientation = cameraLoc.orientation;

		this.displacement.overwriteWith
		(
			cameraOrientation.right
		).multiplyScalar
		(
			this.displacementAmountsRightAndDown[0]
		).add
		(
			cameraOrientation.down.clone().multiplyScalar
			(
				this.displacementAmountsRightAndDown[1]
			)
		);
		var cameraPos = cameraLoc.pos;
		cameraPos.add(this.displacement);
	}
}
