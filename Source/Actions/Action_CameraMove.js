
// classes

function Action_CameraMove(displacementAmountsRightAndDown)
{
	this.displacementAmountsRightAndDown = displacementAmountsRightAndDown;
	this.displacement = new Coords(0, 0, 0);
	this.polar = new Polar();
}

{
	Action_CameraMove.prototype.perform = function(camera)
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
		/*
		var cameraPosAsPolar = this.polar.fromCoords(cameraPos);
		cameraPosAsPolar.radius = camera.focalLength;
		cameraPosAsPolar.toCoords(cameraPos);

		var cameraOrientationForward = cameraPos.clone().multiplyScalar(-1).normalize();
		cameraOrientation.forwardSet(cameraOrientationForward);
		*/
	}
}
