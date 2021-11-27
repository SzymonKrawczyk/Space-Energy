// Author: Szymon Krawczyk

class Transform {

    constructor() {

        this.x = 0;
        this.y = 0;

        this.width = 0;
        this.height = 0;

        this.rotation = 0;
    }

    addRotation(value) {
        this.rotation += value;
        if(this.rotation >= 360) this.rotation %= 360;
    }

    startRotation() {

        ctx.save();

			ctx.translate(this.x, this.y);
			ctx.rotate(Math.radians(this.rotation));
			ctx.translate(-this.x, -this.y);
				
            //ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        //ctx.restore();
    }

    endRotation() {
        
        ctx.restore();
    }

    distanceToTransform(other) {

        return Math.sqrt(Math.pow(this.x - other.x, 2.0) + Math.pow(this.y - other.y, 2.0));
    }
}