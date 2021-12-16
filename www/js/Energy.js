// Author: Szymon Krawczyk

class Energy extends GameObject2 {

    constructor(image, sound, x, y, targetX, targetY, size, speed, rotationRate) {

        super(32); 

        this.image = image;
        this.alpha = 1.0;
        this.increaseAplha = true;

        this.imageTime = 0.8;
        this.currentImageTimer = 0.0;

        this.imageTransitionTime = 0.5;
        this.currentTransitionTimer = 0.0;
        
        this.transition = false;




        this.sound = sound;
        this.transform.width = size;
        this.transform.height = size;
        this.transform.x = x;
        this.transform.y = y;        
        this.hitboxMultiplayer = 0.9;
        
        this.vx = 0;
        this.vy = 0;      

        this.bounceTime = 0.1;
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

        this.value = 20.0;
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

    collect() {

		this.sound.currentTime = 0;
		this.sound.play();
        this.destroy();
    }

    destroy() {
        
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

        //console.log(this.alpha);
        if(this.transition) {

            this.alpha += this.deltaTime * (1 / this.imageTransitionTime) * (this.increaseAplha ? 1 : -1);

            this.currentTransitionTimer += this.deltaTime;
            if (this.currentTransitionTimer >= this.imageTransitionTime) {    
                this.currentTransitionTimer = 0.0;
                this.transition = false;
                this.alpha = this.increaseAplha ? 1.0 : 0.0;
            }

        } else {

            this.currentImageTimer += this.deltaTime;
            if (this.currentImageTimer >= this.imageTime) {
                this.currentImageTimer = 0.0;
                this.transition = true;
                this.increaseAplha = !this.increaseAplha;
            }
        }
        
    }

    render() {
		
		this.transform.startRotation();

            ctx.globalAlpha = this.alpha;

            ctx.drawImage(
                  this.image[0]
                , this.transform.x - this.transform.width / 2
                , this.transform.y - this.transform.width / 2
                , this.transform.width
                , this.transform.width
            );

            ctx.globalAlpha = 1 - this.alpha;

            ctx.drawImage(
                this.image[1]
              , this.transform.x - this.transform.width / 2
              , this.transform.y - this.transform.width / 2
              , this.transform.width
              , this.transform.width
          );
            
        this.transform.endRotation();
    }
}