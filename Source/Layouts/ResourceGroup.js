"use strict";
class ResourceGroup {
    constructor(resources) {
        this.resources = resources;
    }
    add(other) {
        Resource.addManyToMany(this.resources, other.resources);
        return this;
    }
    isSupersetOf(other) {
        return Resource.isSupersetOf(this.resources, other.resources);
    }
    subtract(other) {
        Resource.subtract(this.resources, other.resources);
        return this;
    }
}
