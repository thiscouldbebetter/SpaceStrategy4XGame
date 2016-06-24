
function Orientation(forward, down)
{
	this.forward = forward.clone().normalize();
	this.right = down.clone().crossProduct(this.forward).normalize();
	this.down = this.forward.clone().crossProduct(this.right).normalize();
}

{
	Orientation.prototype.overwriteWith = function(other)
	{
		this.forward.overwriteWith(other.forward);
		this.right.overwriteWith(other.right);
		this.down.overwriteWith(other.down);
	}
}
