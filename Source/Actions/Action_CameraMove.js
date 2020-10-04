
class Action_CameraMove
{
	constructor(displacementAmountsRightAndDown)
	{
		this.displacementAmountsRightAndDown = displacementAmountsRightAndDown;
		this.displacement = new Coords(0, 0, 0);
		this.polar = new Polar();
	}

	perform(camera)
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
