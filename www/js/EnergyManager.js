// Author: Szymon Krawczyk

class EnergyManager extends GameObject2 {

    constructor(image) {

        super(4); 
        
        this.image = image;

        this.sizeLow = 20;
        this.sizeRange = 15;

        this.speedLow = 5;
        this.speedRange = 10;

        this.rotationLow = 45;
        this.rotationRange = 135;

        this.probabilityLR = (canvas.height - canvas.heightStart) / (canvas.width + canvas.height - canvas.heightStart);

        this.canvasSpawnOffset = 100;
        this.spawnHeightLength = canvas.height - canvas.heightStart;
        this.spawnWidthLength  = canvas.width;
        
        this.isActive = false;
        this.spawnInterval = 2.0;
        this.currentSpawnTimer = 0.0;

        console.log(this);
    }    

    reset() {

        for (let i = 0; i < _energyArray.arr.length;) _energyArray.removeAt(i);     
        this.isActive = false;   
        this.currentSpawnTimer = 0.0;
    }

    startAI() {

        this.isActive = true;
        this.currentSpawnTimer = 0.0;
    }

    updateState() {
        
        if (this.isActive) {

            this.currentSpawnTimer += this.deltaTime;

            if(this.currentSpawnTimer >= this.spawnInterval) {

                console.log(`Spawning energy!`);
                this.currentSpawnTimer = 0.0;

                let tempX = 0;
                let tempY = 0;
                let tempTargetX = 0;
                let tempTargetY = 0;

                const LR = Math.random() <= this.probabilityLR;
                const sideLow = Math.random() >= 0.5;

                //console.log(LR);
                //console.log(sideLow);
                if(LR) {

                    if(sideLow) {   // spawn left, go right

                        tempX = -1 * this.canvasSpawnOffset;
                        tempY = canvas.heightStart + Math.random() * this.spawnHeightLength;

                        tempTargetX = canvas.width + this.canvasSpawnOffset;
                        tempTargetY = canvas.heightStart + Math.random() * this.spawnHeightLength;

                    } else {        // spawn right, go left

                        tempX = canvas.width + this.canvasSpawnOffset;
                        tempY = canvas.heightStart + Math.random() * this.spawnHeightLength;

                        tempTargetX = -1 * this.canvasSpawnOffset;
                        tempTargetY = canvas.heightStart + Math.random() * this.spawnHeightLength;
                    }

                } else {

                    if(sideLow) {   // spawn bottom, go top

                        tempX = Math.random() * this.spawnWidthLength;
                        tempY = canvas.height + this.canvasSpawnOffset;

                        tempTargetX = Math.random() * this.spawnWidthLength;
                        tempTargetY = canvas.heightStart - this.canvasSpawnOffset;

                    } else {        // spawn top, go bottom
                        
                        tempX = Math.random() * this.spawnWidthLength;
                        tempY = canvas.heightStart - this.canvasSpawnOffset;

                        tempTargetX = Math.random() * this.spawnWidthLength;
                        tempTargetY = canvas.height + this.canvasSpawnOffset;
                    }
                }

                const rEnergy = Math.random();
                let tempSize = this.sizeLow + this.sizeRange * rEnergy;
                let tempSpeed = this.speedLow + this.speedRange * (1.0 - rEnergy);
                let tempRotation = this.rotationLow + this.rotationRange * (1.0 - rEnergy);

                let newEnergy = new Energy(this.image, tempX, tempY, tempTargetX, tempTargetY, tempSize, tempSpeed, tempRotation, LR);

                //console.log(newEnergy);
                newEnergy.start();
                _energyArray.add(newEnergy);
                //console.log(_energyArray);
            }
        }
    }
}