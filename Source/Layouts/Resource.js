"use strict";
class Resource {
    constructor(defnName, quantity) {
        this.defnName = defnName;
        this.quantity = quantity;
    }
    static addManyToMany(resourcesToBeAdded, resourcesToAddTo) {
        for (var r = 0; r < resourcesToBeAdded.length; r++) {
            var resourceToBeAdded = resourcesToBeAdded[r];
            var resourceDefnName = resourceToBeAdded.defnName;
            var resourceExisting = resourcesToAddTo.filter(x => x.defnName == resourceDefnName)[0];
            if (resourceExisting == null) {
                resourceExisting = new Resource(resourceDefnName, 0);
                resourcesToAddTo.push(resourceExisting);
            }
            resourceExisting.quantity += resourceToBeAdded.quantity;
        }
    }
    static isSupersetOf(resourcesThis, resourcesOther) {
        var returnValue = true;
        for (var i = 0; i < resourcesOther.length; i++) {
            var resourceOther = resourcesOther[i];
            var resourceOtherDefnName = resourceOther.defnName;
            var resourceThisFound = null;
            for (var j = 0; j < resourcesThis.length; j++) {
                var resourceThis = resourcesThis[j];
                var resourceThisDefnName = resourceThis.defnName;
                if (resourceThisDefnName == resourceOtherDefnName) {
                    resourceThisFound = resourceThis;
                    break;
                }
            }
            var resourceThisQuantity = (resourceThisFound == null ? 0 : resourceThisFound.quantity);
            if (resourceThisQuantity < resourceOther.quantity) {
                returnValue = false;
                break;
            }
        }
        return returnValue;
    }
    static subtract(resourcesToSubtractFrom, resourcesToBeSubtracted) {
        for (var r = 0; r < resourcesToBeSubtracted.length; r++) {
            var resourceToBeSubtracted = resourcesToBeSubtracted[r];
            var resourceDefnName = resourceToBeSubtracted.defnName;
            var resourceExisting = resourcesToSubtractFrom.filter(x => x.defnName == resourceDefnName)[0];
            if (resourceExisting == null) {
                resourceExisting = new Resource(resourceDefnName, 0);
                resourcesToSubtractFrom.push(resourceExisting);
            }
            resourceExisting.quantity -= resourceToBeSubtracted.quantity;
        }
    }
    // instance methods
    add(resourceToBeAdded) {
        var resourceToBeAddedDefnName = resourceToBeAdded.defnName;
        if (this.defnName == resourceToBeAddedDefnName) {
            this.addQuantity(resourceToBeAdded.quantity);
        }
    }
    addQuantity(quantity) {
        this.quantity += quantity;
    }
    clear() {
        this.quantity = 0;
    }
    toString() {
        return this.defnName + ": " + this.quantity;
    }
}
