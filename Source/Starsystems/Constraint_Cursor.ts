
class Constraint_Cursor implements Constraint
{
	name: string;

	_boundsToRestrictTo: Box;
	_cameraRightOrDown: Coords;
	_displacement: Coords;
	_max: Coords;
	_min: Coords;
	_mousePos: Coords;
	_negativeInfinity: number;
	_positiveInfinity: number;
	_xyPlaneNormal: Coords;

	constructor()
	{
		this.name = "Cursor";

		// Helper variables.

		this._cameraRightOrDown = Coords.create();
		this._displacement = Coords.create();
		this._max = Coords.create();
		this._min = Coords.create();
		this._mousePos = Coords.create();
		this._xyPlaneNormal = new Coords(0, 0, 1);

		this._boundsToRestrictTo = Box.fromMinAndMax(Coords.create(), Coords.create());
		this._positiveInfinity = 1000000000; // Number.POSITIVE_INFINITY;
		this._negativeInfinity = -1000000000; // Number.NEGATIVE_INFINITY;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;
		var body = uwpe.entity;

		var cursor = body as Cursor;
		var venue = (universe.venueCurrent() as VenueStarsystem);

		var camera = venue.camera();
		var cameraLoc = camera.loc;
		var cameraPos = cameraLoc.pos;
		var cameraOrientation = cameraLoc.orientation;

		var mousePos = this._mousePos.overwriteWith
		(
			universe.inputHelper.mouseMovePos
		);
		mousePos.subtract(camera.viewSizeHalf);

		var directionFromCameraToMousePosProjected = this._displacement.overwriteWith
		(
			cameraOrientation.forward
		).multiplyScalar
		(
			camera.focalLength
		).add
		(
			this._cameraRightOrDown.overwriteWith
			(
				cameraOrientation.right
			).multiplyScalar
			(
				mousePos.x
			)
		).add
		(
			this._cameraRightOrDown.overwriteWith
			(
				cameraOrientation.down
			).multiplyScalar
			(
				mousePos.y
			)
		).normalize();

		var rayFromCameraToMousePos =
			new Ray(cameraPos, directionFromCameraToMousePosProjected );

		var cursorPos = cursor.locatable().loc.pos;

		if (cursor.hasXYPositionBeenSpecified == false)
		{
			this._boundsToRestrictTo.fromMinAndMax
			(
				this._min.overwriteWithDimensions
				(
					this._negativeInfinity, this._negativeInfinity, 0
				),
				this._max.overwriteWithDimensions
				(
					this._positiveInfinity, this._positiveInfinity, 0
				)
			);

			var planeToRestrictTo = new Plane(this._xyPlaneNormal, 0);

			var collisionPos = new CollisionExtended().rayAndPlane
			(
				rayFromCameraToMousePos, planeToRestrictTo
			).pos;

			if (collisionPos != null)
			{
				cursorPos.overwriteWith(collisionPos);
			}
		}
		else // if (cursor.hasXYPositionBeenSpecified)
		{
			this._boundsToRestrictTo.fromMinAndMax
			(
				this._min.overwriteWithDimensions
				(
					cursorPos.x, cursorPos.y, this._negativeInfinity
				),
				this._max.overwriteWithDimensions
				(
					cursorPos.x, cursorPos.y, this._positiveInfinity
				)
			);

			var planeNormal = this._xyPlaneNormal.clone().crossProduct
			(
				cameraOrientation.right
			);

			cursorPos.z = 0;

			var planeToRestrictTo =
				new Plane(planeNormal, cursorPos.dotProduct(planeNormal));

			var collisionPos = new CollisionExtended().rayAndPlane
			(
				rayFromCameraToMousePos, planeToRestrictTo
			).pos;

			if (collisionPos != null)
			{
				cursorPos.z = collisionPos.z;
			}
		}

		cursorPos.trimToRangeMinMax
		(
			this._boundsToRestrictTo.min(), this._boundsToRestrictTo.max()
		);
	}

	// Clonable.
	clone(): Constraint { return this; }
	overwriteWith(other: Constraint): Constraint { return this; }
}
