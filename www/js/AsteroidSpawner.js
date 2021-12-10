// Author: Szymon Krawczyk

// Warning to indicate asteroid spawn

class AsteroidSpawner extends GameObject2 {

    constructor(x, y, size, asteroid, TTL, manager) {

        super(8); 

        this.image = image_asteroidWarning;
        this.transform.width = size;
        this.transform.height = size;
        this.transform.x = x;
        this.transform.y = y;

        this.asteroid = asteroid;

        this.TTL = TTL;
        this.manager = manager;

        this.currentTime = 0.0;
    }

    destroy() {

        this.stopAndHide();
    }

    updateState() {
        
        this.currentTime += this.deltaTime;
        
        if (this.currentTime >= this.TTL) {

            //console.log(`Releasing asteroid!`);

            this.currentTime = 0;
            this.asteroid.start();
            this.destroy();
            this.manager.warningArray.remove(this);
        }
    }

    render() {		

        ctx.drawImage(
              this.image
            , this.transform.x - this.transform.width / 2
            , this.transform.y - this.transform.width / 2
            , this.transform.width
            , this.transform.width
        );        
    }
}