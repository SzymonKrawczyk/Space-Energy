// Author: Szymon Krawczyk

class MovingStatsBackground extends GameObject2 {

    constructor(image, speedLow, speedHigh, cps) {

        super(cps); 

        this.image = image;
        this.transform.width = canvas.heightStart;
        this.transform.height = canvas.heightStart;
        this.transform.x = 0;
        this.transform.y = 0;
        
        this.speed = Math.getRandomIntInclusive(speedLow, speedHigh);
        
        this.timesWidth = Math.ceil(canvas.width / (this.transform.width - 2)) + 1;
    }

    updateState() {
		
        this.transform.x += this.speed * this.deltaTime;

        if (this.transform.x <= -this.transform.width) {

            this.transform.x = -2;
        }
    }

    render() {
		
        for(let i = 0; i < this.timesWidth; ++i) {

            ctx.drawImage(this.image, this.transform.x + (this.transform.width - 2) * i, this.transform.y, this.transform.width, this.transform.height);
        }
    }
}