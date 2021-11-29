// Author: Szymon Krawczyk

class CanvasObjectSpawner extends GameObject2 {

    constructor(imageArray, sizeLow, sizeHigh, speedLow, speedHigh, canvasSpawnOffset, delaySpawn) {

        super(8); 
        
        this.imageArray = imageArray;

        this.sizeLow = sizeLow;
        this.sizeRange = sizeHigh - sizeLow;

        this.speedLow = speedLow;
        this.speedRange = speedHigh - speedLow;

        this.probabilityLR = (canvas.height - canvas.heightStart) / (canvas.width + canvas.height - canvas.heightStart);
        this.canvasSpawnOffset = canvasSpawnOffset;
        this.delaySpawn = delaySpawn;
        this.isActive = false;
    }    

    updateState() {
        
    }
}