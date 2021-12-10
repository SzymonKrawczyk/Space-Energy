// Author: Szymon Krawczyk

class Enemy extends GameObject2 {

	constructor (image_Ship, image_Shield, target){
		
		// Init
		super(64);
		
		// Image
		this.image_Ship = image_Ship;

		// Position, Movement
		this.transform.width = 48;
		this.transform.height = 48;

		this.transform.x = canvas.width / 2.0;
		this.transform.y = canvas.heightStart + this.transform.height;

		this.rotationRate = 270;		
		this.rortationDirection = 1;

        this.speed = 40;
		this.vx = 0.0;
		this.vy = 0.0;

        this.hitboxMultiplayer = 0.9;

        // Target
        this.target = target;
        this.targetVector = {x: 0, y: 0};
        this.targetVectorMultiplayer = 8;
        this.state = "Waiting"; // "Calculating", "Moving"
        this.currentStateTimer = 0.0;
        this.stateTimerCalculating = 1.3;
        this.stateTimerMoving = 0.8;

		// Shield
		this.image_Shield = image_Shield;
		this.shieldSizeMultiplayer = 1.4;
	}

	reset() {		
		
		this.transform.x = canvas.width / 2.0;
		this.transform.y = canvas.heightStart + this.transform.height;

        this.state = "Waiting";

        this.resetTarget();
	}

    startAI() {

        this.state = "Calculating";
    }

    resetTarget() {

        this.vx = 0.0;
		this.vy = 0.0;
    }

    calculateTargetVector() {

        // vector to target
        this.targetVector = {

              x: this.target.transform.x - this.transform.x
            , y: this.target.transform.y - this.transform.y
        }

        // normalize
        const distance = this.distanceToObject(this.target);
        this.targetVector.x = this.targetVector.x / distance;
        this.targetVector.y = this.targetVector.y / distance;

        this.vx = this.targetVector.x * this.targetVectorMultiplayer;
		this.vy = this.targetVector.y * this.targetVectorMultiplayer;

        // NaN fix
        if(!this.vx) this.vx = 0.0;
        if(!this.vy) this.vy = 0.0;
        
		if(this.vx > 0) this.rortationDirection = 1;
		else this.rortationDirection = -1;
    }
	
	updateState() {

        //leaping
        if (this.state != "Waiting") this.currentStateTimer += this.deltaTime;

        switch (this.state) {

            case "Calculating": 

                if(this.currentStateTimer >= this.stateTimerCalculating * _GLOBAL.multiplayers.enemyWaiting) {

                    this.calculateTargetVector();
                    this.currentStateTimer = 0.0;
                    this.state = "Moving";
                }
            break;

            case "Moving":

                if(this.currentStateTimer >= this.stateTimerMoving) {

                    this.resetTarget();
                    this.currentStateTimer = 0.0;
                    this.state = "Calculating";
                }
            break;
        }


		//rotation
		this.transform.addRotation(this.rotationRate * this.rortationDirection * this.deltaTime);		

		//movement
        this.transform.x += this.vx * this.speed * this.deltaTime;
        if (this.transform.x > canvas.width - this.transform.width / 2) {
			
            
            this.transform.x = canvas.width - this.transform.width / 2;

        } else if (this.transform.x < 0 + this.transform.width / 2) {
			
			this.transform.x = 0 + this.transform.width / 2;
		}	

		this.transform.y += this.vy * this.speed * this.deltaTime;
        if (this.transform.y > canvas.height - this.transform.width / 2) {
			
            
            this.transform.y = canvas.height - this.transform.width / 2;

        } else if (this.transform.y < canvas.heightStart + this.transform.width / 2) {
			
			this.transform.y = canvas.heightStart + this.transform.width / 2;
		}
    }

    render() {
		
		this.transform.startRotation();
        	ctx.drawImage(
				this.image_Ship
				, this.transform.x - this.transform.width / 2
				, this.transform.y - this.transform.width / 2
				, this.transform.width
				, this.transform.width
			);

			ctx.drawImage(
				  this.image_Shield
				, this.transform.x - this.transform.width * this.shieldSizeMultiplayer / 2
				, this.transform.y - this.transform.width * this.shieldSizeMultiplayer / 2
				, this.transform.width * this.shieldSizeMultiplayer
				, this.transform.width * this.shieldSizeMultiplayer
            );
		this.transform.endRotation();
    }
}