// Author: Szymon Krawczyk

class Explosion extends GameObject2 {

    constructor(x, y, size) {

        super(32); 

        this.transform.width = size; 
        this.transform.height = size;
        this.transform.x = x;
        this.transform.y = y;

        this.TTL = 1.0;
        
        this.spriteSheet = image_explosion; //global image
        console.log(this.spriteSheet);
        this.spriteCount = 14;
        this.spriteInterval = this.TTL / this.spriteCount;
        this.currentSpriteTimer = 0.0;

        const spriteSheetWidth = 512;
        const spriteSheetHeight = 512;
        this.columns = 4;
        this.rows = 4;
        this.singleSpriteWidth = spriteSheetWidth / this.columns;
        this.singleSpriteHeight = spriteSheetHeight / this.rows;
        
        this.currentRow = 0;
        this.currentColumn = 0;

        sound_explosion.currentTime = 0;
        sound_explosion.volume = 0.5;
		sound_explosion.play();
    }


    destroy() {
        
        _explosionArrray.remove(this);
        this.stopAndHide();
    }

    updateState() {
		
        this.currentSpriteTimer += this.deltaTime;

        if(this.currentSpriteTimer >= this.spriteInterval) {

            this.currentSpriteTimer = 0.0;

            let currentSprite = this.currentRow * this.columns + this.currentColumn;
            //console.log(currentSprite + " " + this.currentRow + " " + this.currentColumn);

            if (currentSprite >= this.spriteCount - 1) {

                this.destroy();
            }

            this.currentColumn++;
            if (this.currentColumn >= this.columns) {

                this.currentColumn = 0;
                this.currentRow++;
            }      
        }      
    }

    render() {

        ctx.drawImage(
            this.spriteSheet, 

            this.currentColumn * this.singleSpriteWidth, 
            this.currentRow * this.singleSpriteHeight, 

            this.singleSpriteWidth, this.singleSpriteHeight, 

            this.transform.x - parseInt(this.transform.width / 2), this.transform.y - parseInt(this.transform.height / 2), 
            this.transform.width, this.transform.height
        );
    }
}