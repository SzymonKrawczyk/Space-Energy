// Author: Szymon Krawczyk

class AsteroidSpawner extends GameObject2 {

    constructor(image, x, y, size, asteroid, TTL, manager) {

        super(8); 

        this.image = image;
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

            console.log(`Releasing asteroid!`);

            this.currentTime = 0;
            this.asteroid.start();
            this.destroy();
            //console.log(this.manager.warningArray);
            this.manager.warningArray.remove(this);
            //console.log(this.manager.warningArray);
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