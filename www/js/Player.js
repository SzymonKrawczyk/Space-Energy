// Author: Szymon Krawczyk

class Player extends GameObject2 {

	constructor (image){
		
		super(64);
		
		this.image = image;

		this.transform.x = canvas.width / 2.0;
		this.transform.y = canvas.height / 2.0;

		this.transform.width = 64;
		this.transform.height = 64;

		this.rotationRate = 90;
		
		this.vx = 0.0;
		this.vy = 0.0;
	}
	
	setOrientation(x, y) {

		this.vx = x / 10.0;
		this.vy = y / 10.0;
	}
	
	updateState() {

		this.transform.addRotation(this.rotationRate * this.deltaTime);		

        this.transform.x += this.vx;
        if (this.transform.x > canvas.width - this.transform.width / 2) {
			
            this.transform.x = canvas.width - this.transform.width / 2;
			
        } else if (this.transform.x < 0 + this.transform.width / 2) {
			
			this.transform.x = 0 + this.transform.width / 2;
		}
		
		this.transform.y += this.vy;
        if (this.transform.y > canvas.height - this.transform.width / 2) {
			
            this.transform.y = canvas.height - this.transform.width / 2;
			
        } else if (this.transform.y < 0 + this.transform.width / 2) {
			
			this.transform.y = this.transform.width / 2;
		}
    }

    render() {
		
		this.transform.startRotation();
        ctx.drawImage(this.image, this.transform.x - this.transform.width / 2, this.transform.y - this.transform.width / 2, this.transform.width, this.transform.width);
		this.transform.endRotation();
    }
}