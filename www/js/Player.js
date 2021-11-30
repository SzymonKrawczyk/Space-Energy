// Author: Szymon Krawczyk

class Player extends GameObject2 {

	constructor (image_Ship, image_Shield){
		
		// Init
		super(64);
		
		// Image
		this.image_Ship = image_Ship;

		// Position, Movement
		this.transform.x = canvas.width / 2.0;
		this.transform.y = ((canvas.height - canvas.heightStart) / 2.0) + canvas.heightStart;

		this.transform.width = 48;
		this.transform.height = 48;

		this.rotationRate = 90;
		
		this.speed = 60;
		this.vx = 0.0;
		this.vy = 0.0;

		// Shield
		this.image_Shield = image_Shield;
		this.shieldSizeMultiplayer = 1.4;
		this.isShieldActive = false;
		this.isShieldVisible = false;

		this.shieldTime = 2.0;
		this.currentShieldTimer = 0.0;

		this.shieldBlinkingStart = 1.0;
		this.shieldBlinkingInterval = 0.15;
		this.currentBlinkingTimer = 0.0;

		// Energy
		this.energyMax = 150.0;
		this.energy = this.energyMax;
		this.energyUsagePerSecond = 5.0;
		this.energyUsagePerShield = 25.0;
	}

	reset() {		
		
		this.energy = this.energyMax;
		this.isShieldActive = false;
		this.isShieldVisible = false;
	}

	takeDamage() {

		if(this.isShieldActive) {

			console.log("Shield! No Damage!");

		} else {

			if(this.energy <= 0) {
				
				console.log("No energy!");
				return;
			}

			console.log("Damage!");

			this.energy -= this.energyUsagePerShield;

			if(this.energy <= 0) {

				console.log("No Energy! Critcal damage!");
				this.energy = 0;

				return;
			}

			this.isShieldActive = true;
			this.isShieldVisible = true;
			this.currentShieldTimer = 0.0;
		}
    }

	collectEnergy(value) {

		if (this.energy <= 0) {
			return;
		}

		this.energy += value;

		if(this.energy >= this.energyMax) {

			this.energy = this.energyMax;
		}
	}
	
	setOrientation(x, y) {

		if(this.energy <= 0) return;

		this.vx = x / 5.0;
		this.vy = y / 5.0;
		//console.log(this.vx);
		//console.log(this.vy);
	}
	
	updateState() {

		//rotation
		this.transform.addRotation(this.rotationRate * this.deltaTime);		

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

		//energy
		if(_GLOBAL.gameState == "Playing"){			

			if(this.energy > 0) {

				this.energy -= this.energyUsagePerSecond * this.deltaTime;

				if(this.energy <= 0) {

					this.energy = 0;
				}
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