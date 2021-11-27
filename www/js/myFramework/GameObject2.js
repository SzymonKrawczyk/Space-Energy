// Author: Szymon Krawczyk

class GameObject2 extends GameObject {

    constructor(calculationsPerSecond, delay = 0) {

        super(1000 / calculationsPerSecond, delay);

        this.calculationsPerSecond = calculationsPerSecond;
        this.deltaTime = (1000 / this.calculationsPerSecond) / 1000.0;

        this.delay = delay;

        this.transform = new Transform();
    }

    distanceToObject(other) {
        
        return this.transform.distanceToTransform(other.transform);
    }
}