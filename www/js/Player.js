// Author: Szymon Krawczyk

class Player extends GameObject2 {

	constructor (image_Ship, image_Shield){
		
		// Init
		super(64);
		
		// Image
		this.image_Ship = image_Ship;

		// Position, Movement
		this.transform.x = canvas.width / 2.0;
		this.transform.y = canvas.height / 2.0;

		this.transform.width = 64;
		this.transform.height = 64;

		this.rotationRate = 90;
		
		this.vx = 0.0;
		this.vy = 0.0;


		// Shield
		this.image_Shield = image_Shield;
		this.shieldSizeMultiplayer = 1.4;
		this.isShieldActive = false;
		this.isShieldVisible = false;

		this.shieldTime = 5.0;
		this.currentShieldTimer = 0.0;

		this.shieldBlinkingStart = 3.0;
		this.shieldBlinkingInterval = 0.15;
		this.currentBlinkingTimer = 0.0;
	}

	takeDamage() {

		if(this.isShieldActive) {

			console.log("Shield! No Damage!");

		} else {

			console.log("Damage!");

			this.isShieldActive = true;
			this.isShieldVisible = true;
			this.currentShieldTimer = 0.0;
		}
    }
	
	setOrientation(x, y) {

		this.vx = x / 10.0;
		this.vy = y / 10.0;
	}
	
	updateState() {

		//rotation
		this.transform.addRotation(this.rotationRate * this.deltaTime);		

		//movement
        this.transform.x += this.vx;
        if (this.transform.x > canvas.width - this.transform.width / 2) {
			
            this.transform.x = canvas.width - this.transform.width / 2;
			
        } else if (this.transform.x < 0 + this.transform.width / 2) {
			
			this.transform.x = 0 + this.transform.width / 2;
		}		
		this.transform.y += this.vy;
        if (this.transform.y > canvas.height - this.transform.width / 2) {
			
            this.transform.y = canvas.height - this.transform.width / 2;
			
        } else if (this.transform.y < 0 + this.transform.width / 2) {
			
			this.transform.y = this.transform.width / 2;
		}

		//shield
		if(this.isShieldActive) {

			this.currentShieldTimer += this.deltaTime;

			if(this.currentShieldTimer >= this.shieldBlinkingStart) {
				
				this.currentBlinkingTimer += this.deltaTime;

				if(this.currentBlinkingTimer >= this.shieldBlinkingInterval) {

					this.isShieldVisible = !this.isShieldVisible;
					this.currentBlinkingTimer = 0.0;
				}
			}

			if(this.currentShieldTimer >= this.shieldTime) {
				
				this.isShieldActive = false;
				this.isShieldVisible = false;
				this.currentShieldTimer = 0.0;

				this.currentBlinkingTimer = 0.0;

				console.log("shield off!");
			}
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

			if(this.isShieldVisible) {

				ctx.drawImage(
					  this.image_Shield
					, this.transform.x - this.transform.width * this.shieldSizeMultiplayer / 2
					, this.transform.y - this.transform.width * this.shieldSizeMultiplayer / 2
					, this.transform.width * this.shieldSizeMultiplayer
					, this.transform.width * this.shieldSizeMultiplayer
				);
			}
		this.transform.endRotation();
    }
}