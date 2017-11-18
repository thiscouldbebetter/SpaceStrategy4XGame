
// classes

function Action_CameraMove(displacementAmountsRightAndDown)
{
	this.displacementAmountsRightAndDown = displacementAmountsRightAndDown;
	this.displacement = new Coords(0, 0, 0);
}

{
	Action_CameraMove.prototype.perform = function(camera)
	{
		this.displacement.overwriteWith
		(
			camera.orientation.right
		).multiplyScalar
		(
			this.displacementAmountsRightAndDown[0]
		).add
		(
			camera.orientation.down.clone().multiplyScalar
			(
				this.displacementAmountsRightAndDown[1]
			)
		);
		var cameraPos = camera.loc.pos;
		cameraPos.add(this.displacement);
		var cameraPosAsPolar = Polar.fromCoords(cameraPos);
		cameraPosAsPolar.radius = camera.focalLength;
		cameraPos.overwriteWith(cameraPosAsPolar.toCoords());

		var cameraOrientationForward = cameraPos.clone().multiplyScalar(-1).normalize();
		camera.orientation.forwardSet(cameraOrientationForward);
	}
}
