// Author: Szymon Krawczyk

class AsteroidManager extends GameObject2 {

    constructor(image_array_asteroids, image_warning) {

        super(4); 
        
        this.image_array_asteroids = image_array_asteroids;
        this.image_warning = image_warning;

        this.sizeLow = 40;
        this.sizeRange = 25;

        this.speedLow = 10;
        this.speedRange = 30;

        this.rotationLow = 45;
        this.rotationRange = 225;

        this.probabilityLR = (canvas.height - canvas.heightStart) / (canvas.width + canvas.height - canvas.heightStart);

        this.canvasSpawnOffset = 100;
        this.spawnHeightLength = canvas.height - canvas.heightStart;
        this.spawnWidthLength  = canvas.width;
        
        this.isActive = false;
        this.spawnInterval = 1.8;
        this.currentSpawnTimer = 0.0;

        this.warningArray = new GameObjectArray();
        this.warningSize = 24;
        this.warningTTL = 2.0;

        console.log(this);
    }    

    reset() {

        for (let i = 0; i < _asteroidArray.arr.length;) _asteroidArray.removeAt(i);     
        this.isActive = false;   
        this.currentSpawnTimer = 0.0;

        for(let i = 0; i < this.warningArray.arr.length;) {

            this.warningArray.getObjectAt(i).destroy();
            this.warningArray.removeAt(i);
        }
    }

    startAI() {

        this.isActive = true;
        this.currentSpawnTimer = 0.0;
    }

    updateState() {
        
        if (this.isActive) {

            this.currentSpawnTimer += this.deltaTime * _GLOBAL.multiplayers.asteroidSpawn;

            if(this.currentSpawnTimer >= this.spawnInterval) {

                //console.log(`Spawning asteroid!`);
                this.currentSpawnTimer = 0.0;

                let tempX = 0;
                let tempY = 0;
                let tempX_w = 0;
                let tempY_w = 0;
                let tempTargetX = 0;
                let tempTargetY = 0;

                const LR = Math.random() <= this.probabilityLR;
                const sideLow = Math.random() >= 0.5;

                //console.log(LR);
                //console.log(sideLow);

                if(LR) {
                    
                    const rand1 = Math.random();
                    const rand2 = Math.random();

                    if(sideLow) {   // spawn left, go right

                        tempX = -1 * this.canvasSpawnOffset;
                        tempY = canvas.heightStart + rand1 * this.spawnHeightLength;
                        
                        tempX_w = this.warningSize / 2 + 10;
                        tempY_w = rand1 * (canvas.height - canvas.heightStart) + canvas.heightStart;

                        tempTargetX = canvas.width + this.canvasSpawnOffset;
                        tempTargetY = canvas.heightStart + rand2 * this.spawnHeightLength;

                    } else {        // spawn right, go left

                        tempX = canvas.width + this.canvasSpawnOffset;
                        tempY = canvas.heightStart + rand1 * this.spawnHeightLength;
                        
                        tempX_w = canvas.width - this.warningSize / 2 - 10;
                        tempY_w = rand1 * (canvas.height - canvas.heightStart) + canvas.heightStart;

                        tempTargetX = -1 * this.canvasSpawnOffset;
                        tempTargetY = canvas.heightStart + rand2 * this.spawnHeightLength;
                    }

                } else {

                    const rand1 = Math.random();
                    const rand2 = Math.random();

                    if(sideLow) {   // spawn bottom, go top

                        tempX =  rand1 * this.spawnWidthLength;
                        tempY = canvas.height + this.canvasSpawnOffset;

                        tempX_w = rand1 * canvas.width;
                        tempY_w = canvas.height - this.warningSize / 2 - 10;

                        tempTargetX = rand2 * this.spawnWidthLength;
                        tempTargetY = canvas.heightStart - this.canvasSpawnOffset;

                    } else {        // spawn top, go bottom
                        
                        tempX = rand1 * this.spawnWidthLength;
                        tempY = canvas.heightStart - this.canvasSpawnOffset;

                        tempX_w = rand1 * canvas.width;
                        tempY_w = canvas.heightStart + this.warningSize / 2 + 10;

                        tempTargetX = rand2 * this.spawnWidthLength;
                        tempTargetY = canvas.height + this.canvasSpawnOffset;
                    }
                }

                const rEnergy = Math.random();
                let rImage = Math.getRandomIntInclusive(0, this.image_array_asteroids.length - 1);
                let tempSize = this.sizeLow + this.sizeRange * rEnergy;
                let tempSpeed = this.speedLow + this.speedRange * (1.0 - rEnergy);
                let tempRotation = this.rotationLow + this.rotationRange * (1.0 - rEnergy);

                let newAsteroid = new Asteroid(this.image_array_asteroids[rImage], tempX, tempY, tempTargetX, tempTargetY, tempSize, tempSpeed, tempRotation, LR);

                //console.log(newAsteroid);
                let newAsteroid_warning = new AsteroidSpawner(this.image_warning, tempX_w, tempY_w, this.warningSize, newAsteroid, this.warningTTL, this);
                newAsteroid_warning.start();
                this.warningArray.add(newAsteroid_warning);
                //newEnergy.start();
                _asteroidArray.add(newAsteroid);
                //console.log(_asteroidArray);
            }
        }
    }

    render() {

        this.warningArray.render();
    }
}