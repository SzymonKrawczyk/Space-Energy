// Author: Szymon Krawczyk

class Energy extends GameObject2 {

    constructor(image, x, y, targetX, targetY, size, speed, rotationRate, movementHorizontal) {

        super(32); 

        this.image = image;
        this.transform.width = size;
        this.transform.height = size;
        this.transform.x = x;
        this.transform.y = y;        
        this.hitboxMultiplayer = 0.9;
        
        this.vx = 0;
        this.vy = 0;
        this.target = new Transform();
        this.target.x = targetX;
        this.target.y = targetY;
        this.targetVector = {x: 0, y: 0};
        this.targetVectorMultiplayer = 8;
        this.calculateTargetVector();
        this.targetSize = 10;
        this.speed = speed;
        
        this.rotationDirection = Math.random() >= 0.5;
		this.rotationRate = rotationRate;

        this.value = 20.0;

        this.movementHorizontal = movementHorizontal;
    }

    calculateTargetVector() {

        // vector to target
        this.targetVector = {

              x: this.target.x - this.transform.x
            , y: this.target.y - this.transform.y
        }

        // normalize
        const distance = this.transform.distanceToTransform(this.target);
        this.targetVector.x = this.targetVector.x / distance;
        this.targetVector.y = this.targetVector.y / distance;

        this.vx = this.targetVector.x * this.targetVectorMultiplayer;
		this.vy = this.targetVector.y * this.targetVectorMultiplayer;
    }

    collect() {

        this.stopAndHide();
    }

    destroy() {
        
        this.stopAndHide();
    }

    updateState() {
		
		this.transform.addRotation(this.rotationRate * this.deltaTime * (this.rotationDirection ? 1 : -1));
        
        this.transform.x += this.vx * this.speed * this.deltaTime;
        
		this.transform.y += this.vy * this.speed * this.deltaTime;
       
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