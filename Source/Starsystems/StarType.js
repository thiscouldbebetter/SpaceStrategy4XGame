"use strict";
class StarType {
    constructor(name, color, radiusInPixels) {
        this.name = name;
        this.color = color;
        this.radiusInPixels = radiusInPixels;
    }
    static Instances() {
        if (StarType._instances == null) {
            StarType._instances = new StarType_Instances();
        }
        return StarType._instances;
    }
    static byName(name) {
        return StarType.Instances().byName(name);
    }
    static random() {
        return StarType.Instances().random();
    }
    bodyDefn() {
        var starRadius = this.radiusInPixels;
        if (this._bodyDefn == null) {
            var visual = this.visualBeforeProjection();
            this._bodyDefn = new BodyDefn("Star", Coords.fromXY(1, 1).multiplyScalar(starRadius), // size
            visual);
        }
        return this._bodyDefn;
    }
    visualBeforeProjection() {
        if (this._visualBeforeProjection == null) {
            var starRadius = this.radiusInPixels;
            var starColor = this.color;
            var visualBody = new VisualCircle(starRadius, starColor, starColor, null);
            var colors = Color.Instances();
            var visualName = VisualText.fromTextBindingFontAndColorsFillAndBorder(DataBinding.fromGet((c) => c.place.name), FontNameAndHeight.fromHeightInPixels(starRadius / 2), colors.Gray, colors.White);
            var visual = new VisualGroup([
                visualBody, visualName
            ]);
            this._visualBeforeProjection = visual;
        }
        return this._visualBeforeProjection;
    }
    visualFromOutside() {
        if (this._visualFromOutside == null) {
            var visual = VisualStar.byName(this.color.name);
            this._visualFromOutside = visual;
        }
        return this._visualFromOutside;
    }
    visualProjected() {
        if (this._visualProjected == null) {
            var visualToProject = this.visualBeforeProjection();
            var visualProjected = new VisualCameraProjection(uwpe => uwpe.place.camera2(uwpe.universe), visualToProject);
            var visualWithStem = new VisualGroup([
                new VisualElevationStem(),
                visualProjected
            ]);
            this._visualProjected = visualWithStem;
        }
        return this._visualProjected;
    }
}
class StarType_Instances {
    constructor() {
        var colors = Color.Instances();
        var radiusNormal = 30;
        this.Blue = new StarType("Blue", colors.Blue, radiusNormal);
        this.Green = new StarType("Green", colors.Green, radiusNormal);
        this.Orange = new StarType("Orange", colors.Orange, radiusNormal);
        this.Red = new StarType("Red", colors.Red, radiusNormal);
        this.White = new StarType("White", colors.White, radiusNormal);
        this.Yellow = new StarType("Yellow", colors.Yellow, radiusNormal);
        this._All =
            [
                this.Blue,
                this.Green,
                this.Orange,
                this.Red,
                this.White,
                this.Yellow
            ];
    }
    byName(name) {
        return this._All.find(x => x.name == name);
    }
    random() {
        var indexRandom = Math.floor(Math.random() * this._All.length);
        var starTypeRandom = this._All[indexRandom];
        return starTypeRandom;
    }
}
