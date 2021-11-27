// Author: Szymon Krawczyk

class MovingBackground extends GameObject2 {

    constructor(image, width, height, y, speedLow, speedHigh, cps) {

        super(cps); 

        this.image = image;
        this.transform.width = width;
        this.transform.height = height;
        this.transform.x = 0;
        this.transform.y = y;
        
        this.speed = Math.getRandomIntInclusive(speedLow, speedHigh);
        
        this.timesWidth = Math.ceil(canvas.width / this.transform.width) + 1;
    }

    updateState() {
		
        this.transform.x += this.speed * this.deltaTime;

        if (this.transform.x <= -this.transform.width) {

            this.transform.x = 0;
        }
    }

    render() {
		
        for(let i = 0; i < this.timesWidth; ++i) {

            ctx.drawImage(this.image, this.transform.x + this.transform.width * i, this.transform.y, this.transform.width, this.transform.height);
        }
    }
}