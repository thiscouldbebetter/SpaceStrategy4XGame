
function DisplayExtensions()
{
	// extension class
}

{
	Display.prototype.drawNetworkForCamera = function(network, camera)
	{
		var drawPos = this.drawPos;
		var drawPosFrom = new Coords(0, 0, 0);
		var drawPosTo = new Coords(0, 0, 0);

		var cameraPos = camera.loc.pos;

		var networkNodes = network.nodes;
		var numberOfNetworkNodes = networkNodes.length;

		var networkLinks = network.links;
		var numberOfNetworkLinks = networkLinks.length;

		this.graphics.fillStyle = "rgba(128, 128, 128, .1)";

		var nodeRadiusActual = NetworkNode.RadiusActual;

		for (var i = 0; i < numberOfNetworkLinks; i++)
		{
			var link = networkLinks[i];
			this.drawNetworkForCamera_Link
			(
				network, camera, link, 
				nodeRadiusActual, drawPos, 
				drawPosFrom, drawPosTo
			);
		}

		for (var i = 0; i < numberOfNetworkNodes; i++)
		{
			var node = networkNodes[i];
			this.drawNetworkForCamera_Node
			(
				node, nodeRadiusActual, camera, drawPos
			);
		}
	}

	Display.prototype.drawNetworkForCamera_Link = function
	(
		network, 
		camera, 
		link,
		nodeRadiusActual, 
		drawPos, 
		drawPosFrom, 
		drawPosTo
	)
	{
		var nodesLinked = link.nodesLinked(network);
		var nodeFromPos = nodesLinked[0].loc.pos;
		var nodeToPos = nodesLinked[1].loc.pos;

		camera.convertWorldCoordsToViewCoords
		(
			drawPosFrom.overwriteWith(nodeFromPos)
		);
		
		camera.convertWorldCoordsToViewCoords
		(
			drawPosTo.overwriteWith(nodeToPos)
		);

		var directionFromNode0To1InView = drawPosTo.clone().subtract
		(
			drawPosFrom
		).normalize();

		var perpendicular = directionFromNode0To1InView.clone().right();

		var perspectiveFactorFrom = 
			camera.focalLength / drawPosFrom.z;
		var perspectiveFactorTo = 
			camera.focalLength / drawPosTo.z;
			
		var radiusApparentFrom = 
			nodeRadiusActual * perspectiveFactorFrom;
		var radiusApparentTo = 
			nodeRadiusActual * perspectiveFactorTo;

		this.graphics.beginPath();
		this.graphics.moveTo(drawPosFrom.x, drawPosFrom.y);
		this.graphics.lineTo(drawPosTo.x, drawPosTo.y);
		this.graphics.lineTo
		(
			drawPosTo.x + perpendicular.x * radiusApparentTo,
			drawPosTo.y + perpendicular.y * radiusApparentTo
		);
		this.graphics.lineTo
		(
			drawPosFrom.x + perpendicular.x * radiusApparentFrom, 
			drawPosFrom.y + perpendicular.y * radiusApparentFrom
		);
		this.graphics.fill();

		for (var i = 0; i < link.ships.length; i++)
		{
			var ship = link.ships[i];
			this.drawNetworkForCamera_Link_Ship
			(
				camera, link, ship, drawPos, nodeFromPos, nodeToPos
			);
		}
	}

	Display.prototype.drawNetworkForCamera_Link_Ship = function
	(
		camera, link, ship, drawPos, nodeFromPos, nodeToPos
	)
	{
		var forward = link.direction();
		var linkLength = link.length();

		var fractionOfLinkTraversed = ship.loc.pos.x / linkLength; 

		if (ship.vel.x < 0)
		{
			fractionOfLinkTraversed = 1 - fractionOfLinkTraversed;
			forward.multiplyScalar(-1);
		}

		drawPos.overwriteWith
		(
			nodeFromPos
		).multiplyScalar
		(
			1 - fractionOfLinkTraversed
		).add
		(
			nodeToPos.clone().multiplyScalar
			(
				fractionOfLinkTraversed
			)
		);

		// todo
		this.graphics.strokeRect(drawPos.x, drawPos.y, 10, 10);

		/*
		var right = forward.clone().perpendicular3D();
		var down = right.clone().crossProduct(forward);

		var scaleFactorLength = 8;
		var scaleFactorBase = scaleFactorLength / 3;
		forward.multiplyScalar(scaleFactorLength);
		right.multiplyScalar(scaleFactorBase);
		down.multiplyScalar(scaleFactorBase);

		var vertices = 
		[
			drawPos.clone().add(forward),
			drawPos.clone().add(right).add(down),
			drawPos.clone().add(right).subtract(down),
			drawPos.clone().subtract(right).subtract(down),
			drawPos.clone().subtract(right).add(down),
		];

		var vertexIndicesForFaces =
		[
			[ 0, 1, 2 ],
			[ 0, 2, 3 ],
			[ 0, 3, 4 ],
			[ 0, 4, 1 ],
		];

		this.graphics.strokeStyle = ship.faction().color.systemColor;
		
		for (var f = 0; f < vertexIndicesForFaces.length; f++)
		{
			var vertexIndicesForFace = vertexIndicesForFaces[f];

			this.graphics.beginPath();
	
			for (var vi = 0; vi < vertexIndicesForFace.length; vi++)
			{
				var vertexIndex = vertexIndicesForFace[vi];
				drawPos.overwriteWith(vertices[vertexIndex]);
				camera.convertWorldCoordsToViewCoords(drawPos);
				var moveToOrLineTo = (vi == 0 ? this.graphics.moveTo : this.graphics.lineTo);
				moveToOrLineTo.call(this.graphics, drawPos.x, drawPos.y);
			}

			this.graphics.closePath();
			this.graphics.stroke();
		}
		*/
	}

	Display.prototype.drawNetworkForCamera_Node = function
	(
		node, nodeRadiusActual, camera, drawPos
	)
	{
		var nodePos = node.loc.pos;

		drawPos.overwriteWith(nodePos);
		camera.convertWorldCoordsToViewCoords(drawPos);

		var perspectiveFactor = camera.focalLength / drawPos.z;
		var radiusApparent = nodeRadiusActual * perspectiveFactor;

		var alpha = Math.pow(perspectiveFactor, 4); // hack

		//var nodeColor = node.defn.color.systemColor;
		var nodeColor = "rgba(128, 128, 128, " + alpha + ")"

		this.graphics.strokeStyle = nodeColor; 
		this.graphics.fillStyle = nodeColor;

		this.graphics.beginPath();
		this.graphics.arc
		(
			drawPos.x, drawPos.y, 
			radiusApparent, 
			0, 2 * Math.PI, // start and stop angles 
			false // counterClockwise
		);
		this.graphics.stroke();

		this.graphics.fillText
		(
			node.starsystem.name, 
			(drawPos.x + radiusApparent), 
			drawPos.y
		);
	}

	Display.prototype.drawLayout = function(layout)
	{
		this.clear();
		this.drawMap(layout.map);
	}

	Display.prototype.drawMap = function(map)
	{
		var pos = map.pos;
		var mapSizeInCells = map.sizeInCells;

		var cellPos = new Coords(0, 0);
		var drawPos = this.drawPos;
		var cellSizeInPixels = map.cellSizeInPixels;
		var cellSizeInPixelsHalf = 
			cellSizeInPixels.clone().divideScalar(2);

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPos.y = y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPos.x = x;

				drawPos.overwriteWith
				(
					cellPos
				).multiply
				(
					cellSizeInPixels
				).add
				(
					pos
				);

				var cell = map.cellAtPos(cellPos);
				var cellBody = cell.body;

				var colorFill = 
				(
					cellBody == null 
					? "Transparent" 
					: cellBody.defn.color
				);
				var colorBorder = cell.terrain.color;

				this.graphics.fillStyle = colorFill;
				this.graphics.fillRect
				(
					drawPos.x,
					drawPos.y,
					cellSizeInPixels.x,
					cellSizeInPixels.y
				);

				this.graphics.strokeStyle = colorBorder;
				this.graphics.strokeRect
				(
					drawPos.x,
					drawPos.y,
					cellSizeInPixels.x,
					cellSizeInPixels.y
				);

			}
		}

		var cursor = map.cursor;
		var cursorPos = cursor.pos;
		var cursorIsWithinMap = cursorPos.isInRangeMax
		(
			map.sizeInCellsMinusOnes
		);

		if (cursorIsWithinMap == true)
		{
			drawPos.overwriteWith
			(
				cursorPos
			).multiply
			(
				cellSizeInPixels
			).add
			(
				pos
			);			

			this.graphics.strokeStyle = "Cyan";

			if (cursor.bodyDefn == null)
			{
				this.graphics.beginPath();
				this.graphics.moveTo(drawPos.x, drawPos.y);
				this.graphics.lineTo
				(
					drawPos.x + cellSizeInPixels.x, 
					drawPos.y + cellSizeInPixels.y
				);
				this.graphics.moveTo
				(
					drawPos.x + cellSizeInPixels.x, 
					drawPos.y
				);
				this.graphics.lineTo
				(
					drawPos.x, 
					drawPos.y + cellSizeInPixels.y
				);
				this.graphics.stroke();
			}			
			else
			{
				this.graphics.fillStyle = cursor.bodyDefn.color;
				this.graphics.fillRect
				(
					drawPos.x,
					drawPos.y,
					cellSizeInPixels.x,
					cellSizeInPixels.y
				);
			}

			this.graphics.strokeRect
			(
				drawPos.x,
				drawPos.y,
				cellSizeInPixels.x,
				cellSizeInPixels.y
			);
		}
	}

	Display.prototype.drawStarsystemForCamera = function(starsystem, camera)
	{
		var cameraViewSize = camera.viewSize;
		var cameraPos = camera.loc.pos;

		var drawPos = this.drawPos;
		var drawPosFrom = new Coords(0, 0, 0);
		var drawPosTo = new Coords(0, 0, 0);

		var gridCellSizeInPixels = new Coords(10, 10, 0);
		var gridSizeInCells = new Coords(40, 40, 0); 
		var gridSizeInPixels = gridSizeInCells.clone().multiply
		(
			gridCellSizeInPixels
		);
		var gridSizeInCellsHalf = gridSizeInCells.clone().divideScalar(2);
		var gridSizeInPixelsHalf = gridSizeInPixels.clone().divideScalar(2);

		var graphics = this.graphics;

		graphics.strokeStyle = Color.Instances.CyanHalfTranslucent.systemColor;

		for (var d = 0; d < 2; d++)
		{
			var multiplier = new Coords(0, 0, 0);
			multiplier.dimension(d, gridCellSizeInPixels.dimension(d));

			for (var i = 0 - gridSizeInCellsHalf.x; i <= gridSizeInCellsHalf.x; i++)			
			{
				drawPosFrom.overwriteWith
				(
					gridSizeInPixelsHalf
				).multiplyScalar(-1);
				drawPosTo.overwriteWith(gridSizeInPixelsHalf);

				drawPosFrom.dimension(d, 0);
				drawPosTo.dimension(d, 0);

				drawPosFrom.add(multiplier.clone().multiplyScalar(i));
				drawPosTo.add(multiplier.clone().multiplyScalar(i));

				camera.convertWorldCoordsToViewCoords(drawPosFrom);
				camera.convertWorldCoordsToViewCoords(drawPosTo);

				graphics.beginPath();
				graphics.moveTo(drawPosFrom.x, drawPosFrom.y);
				graphics.lineTo(drawPosTo.x, drawPosTo.y);
				graphics.stroke();
			}
		}

		var bodiesByType =
		[
			[ starsystem.star ],
			starsystem.linkPortals,
			starsystem.planets,
			starsystem.ships,
		];

		for (var t = 0; t < bodiesByType.length; t++)
		{
			var bodies = bodiesByType[t];

			for (var i = 0; i < bodies.length; i++)
			{
				var body = bodies[i];
				this.drawStarsystemForCamera_Body
				(
					camera, 
					body
				);
			}

		}
	}

	Display.prototype.drawStarsystemForCamera_Body = function(camera, body)
	{
		var graphics = this.graphics;
		var drawPos = new Coords();
		var drawLoc = new Location(drawPos);

		var bodyPos = body.loc.pos;
		drawPos.overwriteWith(bodyPos);
		camera.convertWorldCoordsToViewCoords(drawPos);

		var bodyDefn = body.defn;
		var bodyVisual = bodyDefn.visual;
		bodyVisual.drawToDisplayForDrawableAndLoc(this, body, drawLoc);

		if (bodyPos.z < 0)
		{
			graphics.strokeStyle = Color.Instances.Green.systemColor;
		}
		else
		{
			graphics.strokeStyle = Color.Instances.Red.systemColor;
		}

		graphics.beginPath();
		graphics.moveTo(drawPos.x, drawPos.y);

		drawPos.overwriteWith(bodyPos);
		drawPos.z = 0;
		camera.convertWorldCoordsToViewCoords(drawPos);

		graphics.lineTo(drawPos.x, drawPos.y);
		graphics.stroke();
	}
}
