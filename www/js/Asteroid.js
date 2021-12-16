// Author: Szymon Krawczyk

class Asteroid extends GameObject2 {

    constructor(image, x, y, targetX, targetY, size, speed, rotationRate) {

        super(32); 

        this.image = image;
        this.transform.width = size;
        this.transform.height = size;
        this.transform.x = x;
        this.transform.y = y;        
        this.hitboxMultiplayer = 0.8;

        this.vx = 0;
        this.vy = 0;
        
        this.bounceTime = 0.05;
        this.currentBounceTime = 0.0;
        this.bouncing = false;

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

        this.isActive = true;
        this.alpha = 100;
        this.alphaRemovePerSecond = 1000.0;
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

        if(this.vx > 0) this.rortationDirection = 1;
		else this.rortationDirection = -1;
    }

    takeDamage() {

        if(!this.isActive) return;
        this.isActive = false;

        let explosion = new Explosion(this.transform.x, this.transform.y, this.transform.width);
        _explosionArrray.add(explosion);
        explosion.start();
    }

    bounce() {

        if(this.bouncing) {
                        
            this.currentBounceTime = 0.0;
            return;
        }

        this.vy *= -1;
        this.vx *= -1;        
        
		if(this.vx > 0) this.rortationDirection = 1;
		else this.rortationDirection = -1;

        this.bouncing = true;
        this.currentBounceTime = 0.0;
    }

    destroy() {

        _asteroidArray.remove(this);
        this.stopAndHide();
    }

    updateState() {

        if(this.bouncing) {
            this.currentBounceTime += this.deltaTime;

            if(this.currentBounceTime >= this.bounceTime) {
                this.bouncing = false;
                this.currentBounceTime = 0.0;
            }
        }
		
		this.transform.addRotation(this.rotationRate * this.deltaTime * (this.rotationDirection ? 1 : -1));
        
        this.transform.x += this.vx * this.speed * this.deltaTime;
        
		this.transform.y += this.vy * this.speed * this.deltaTime;

        if(!this.isActive) {

            this.alpha -= this.alphaRemovePerSecond * this.deltaTime;
            if(this.alpha <= 0) {
                this.destroy();
            }
        }
    }

    render() {
		
		this.transform.startRotation();

        if(!this.isActive) {

            ctx.globalAlpha = this.alpha / 100.0;
        }

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