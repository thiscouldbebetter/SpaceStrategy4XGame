"use strict";
class ControlDynamic extends ControlBase {
    constructor(name, pos, size, binding, boundValueToControl) {
        super(name, pos, size, null); //fontHeightInPixels
        this.name = name;
        this.pos = pos;
        this.size = size;
        this.binding = binding;
        this.boundValueToControl = boundValueToControl;
        this.boundValuePrev = null;
        this.child = null;
        // Helper variables.
        this.drawPos = Coords.create();
        this.drawLoc = Disposition.fromPos(this.drawPos);
        this.mouseClickPos = Coords.create();
        this.mouseMovePos = Coords.create();
    }
    actionHandle(actionNameToHandle, universe) {
        var wasActionHandled = false;
        if (this.child != null) {
            wasActionHandled = this.child.actionHandle(actionNameToHandle, universe);
        }
        return wasActionHandled;
    }
    childWithFocus() {
        return (this.child == null ? null : this.child.childWithFocus());
    }
    focusGain() {
        if (this.child != null && this.child.focusGain != null) {
            this.child.focusGain();
        }
    }
    focusLose() {
        if (this.child != null && this.child.focusLose != null) {
            this.child.focusLose();
        }
    }
    isEnabled() {
        return true;
    }
    mouseClick(mouseClickPos) {
        var wasHandledByChild = false;
        if (this.child != null && this.child.mouseClick != null) {
            mouseClickPos = this.mouseClickPos.overwriteWith(mouseClickPos).subtract(this.pos);
            wasHandledByChild = this.child.mouseClick(mouseClickPos);
        }
        return wasHandledByChild;
    }
    mouseEnter() {
        if (this.child != null && this.child.mouseEnter != null) {
            this.child.mouseEnter();
        }
    }
    mouseExit() {
        if (this.child != null && this.child.mouseExit != null) {
            this.child.mouseExit();
        }
    }
    mouseMove(mouseMovePos) {
        var wasHandled = false;
        if (this.child != null && this.child.mouseMove != null) {
            var mouseMovePos = this.mouseMovePos.overwriteWith(mouseMovePos).subtract(this.pos);
            wasHandled = this.child.mouseMove(mouseMovePos);
        }
        return wasHandled;
    }
    // drawable
    draw(universe, display, drawLoc, style) {
        var boundValue = this.binding.get();
        if (boundValue != this.boundValuePrev) {
            this.boundValuePrev = boundValue;
            if (boundValue == null) {
                this.child = null;
            }
            else {
                var child = this.boundValueToControl(boundValue);
                this.child = child;
            }
        }
        if (this.child != null) {
            var drawLoc = this.drawLoc.overwriteWith(drawLoc);
            drawLoc.pos.add(this.pos);
            this.child.draw(universe, display, drawLoc, style);
        }
    }
}
