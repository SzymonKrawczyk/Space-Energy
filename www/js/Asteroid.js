// Author: Szymon Krawczyk

class Asetroid extends GameObject2 {

    constructor(image, x, y, size, speed, cps) {

        super(cps); 

        this.image = image;
        this.transform.width = size;
        this.transform.height = size;
        this.transform.x = x;
        this.transform.y = y;
        
        this.speed = speed;
        
		this.rotationRate = 90;
    }

    takeDamage() {
        this.stopAndHide();
    }

    updateState() {
		
		this.transform.addRotation(this.rotationRate * this.deltaTime * this.speed);	
    }

    render() {
		
		this.transform.startRotation();
            ctx.drawImage(this.image, this.transform.x - this.transform.width / 2, this.transform.y - this.transform.width / 2, this.transform.width, this.transform.width);
        this.transform.endRotation();
    }
}