"use strict";
class ControlDynamic extends ControlBase {
    constructor(name, pos, size, binding) {
        super(name, pos, size, null); //fontHeightInPixels
        this.name = name;
        this.pos = pos;
        this.size = size;
        this.binding = binding;
        this.boundValuePrev = null;
        this.child = null;
        // Helper variables.
        this.drawPos = Coords.create();
        this.drawLoc = Disposition.fromPos(this.drawPos);
        this.mouseClickPos = Coords.create();
        this.mouseMovePos = Coords.create();
    }
    actionHandle(actionNameToHandle) {
        var wasActionHandled = false;
        if (this.child != null) {
            wasActionHandled = this.child.actionHandle(actionNameToHandle);
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
            return this.child.mouseEnter();
        }
    }
    mouseExit() {
        if (this.child != null && this.child.mouseExit != null) {
            return this.child.mouseExit();
        }
    }
    mouseMove(mouseMovePos) {
        if (this.child != null && this.child.mouseMove != null) {
            mouseMovePos = this.mouseMovePos.overwriteWith(mouseMovePos).subtract(this.pos);
            return this.child.mouseMove(mouseMovePos);
        }
    }
    // drawable
    draw(universe, display, drawLoc, style) {
        var boundValue = this.binding.get();
        if (boundValue != this.boundValuePrev) {
            this.boundValuePrev = boundValue;
            if (boundValue == null) {
                this.child = null;
            }
            else if (boundValue.toControl != null) {
                this.child = boundValue.toControl(universe, this.size);
            }
        }
        if (this.child != null) {
            var drawLoc = this.drawLoc.overwriteWith(drawLoc);
            drawLoc.pos.add(this.pos);
            this.child.draw(universe, display, drawLoc);
        }
    }
}
