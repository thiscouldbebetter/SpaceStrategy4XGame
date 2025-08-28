"use strict";
class PlanetAsPlace extends PlaceBase {
    constructor(planet) {
        super(planet.name, null, // defnName
        null, // parentName
        null, // size
        null // entities
        );
        this.planet = planet;
    }
}
