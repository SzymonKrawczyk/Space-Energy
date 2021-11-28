// Author: Szymon Krawczyk

class Energy extends GameObject2 {

    constructor(image, x, y, size, speed, cps) {

        super(cps); 

        this.image = image;
        this.transform.width = size;
        this.transform.height = size;
        this.transform.x = x;
        this.transform.y = y;
        
        this.speed = speed;
        
        this.rotationDirection = Math.getRandomIntInclusive(0, 1) == 0;
		this.rotationRate = 45;

        this.value = 10.0;
    }

    collect() {

        this.stopAndHide();
    }

    updateState() {
		
		this.transform.addRotation(this.rotationRate * this.deltaTime * this.speed * (this.rotationDirection ? 1 : -1));	
    }

    render() {
		
		this.transform.startRotation();

            ctx.drawImage(
                this.image
                , this.transform.x - this.transform.width / 2
                , this.transform.y - this.transform.width / 2
                , this.transform.width
                , this.transform.width
            );
            
        this.transform.endRotation();
    }
}