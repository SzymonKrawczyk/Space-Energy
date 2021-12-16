// Author: Szymon Krawczyk

class Player extends GameObject2 {

	constructor (image_Ship, image_Shield, sound_shield_up, sound_shield_down){
		
		// Init
		super(64);
		
		// Image
		//this.image_Ship = image_Ship;
		this.spriteSheet = image_Ship;
        this.spriteCount = 4;
        this.spriteInterval = 0.5;
        this.currentSpriteTimer = 0.0;

        const spriteSheetWidth = 182;
        const spriteSheetHeight = 182;
        this.columns = 2;
        this.rows = 2;
        this.singleSpriteWidth = spriteSheetWidth / this.columns;
        this.singleSpriteHeight = spriteSheetHeight / this.rows;
        
        this.currentRow = 0;
        this.currentColumn = 0;

		// Sounds
		this.sound_shield_up = sound_shield_up;
		this.sound_shield_down = sound_shield_down;

		// Position, Movement
		this.transform.width = 54;
		this.transform.height = 54;

		this.transform.x = canvas.width / 2.0;
		this.transform.y = canvas.height - this.transform.height;

		this.rotationRateMin = 45;
		this.rotationRate = this.rotationRateMin;
		this.rortationDirection = 1;
		
		this.speed = 60;
		this.vx = 0.0;
		this.vy = 0.0;

		// Shield
		this.image_Shield = image_Shield;
		this.shieldSizeMultiplayer = 1.4;
		this.isShieldActive = false;
		this.isShieldVisible = false;

		this.shieldTime = 1.0;
		this.currentShieldTimer = 0.0;

		this.shieldBlinkingStart = 0.5;
		this.shieldBlinkingInterval = 0.1;
		this.currentBlinkingTimer = 0.0;

		// Energy
		this.energyMax = 250.0;
		this.energy = this.energyMax;
		this.energyUsagePerSecond = 6.5;
		this.energyUsagePerShield = 25.0;
	}

	reset() {		
		
		this.energy = this.energyMax;
		this.isShieldActive = false;
		this.isShieldVisible = false;
	}

	takeDamage() {

		if(this.isShieldActive) {

			//console.log("Shield! No Damage!");

		} else {

			if(this.energy <= 0) {
				
				//console.log("No energy!");
				return;
			}

			//console.log("Damage!");

			this.energy -= this.energyUsagePerShield;

			if(this.energy <= 0) {

				//console.log("No Energy! Critcal damage!");
				this.energy = 0;

				return;
			}

			this.isShieldActive = true;
			this.isShieldVisible = true;
			this.currentShieldTimer = 0.0;

			this.sound_shield_up.currentTime = 0;
			this.sound_shield_up.play();
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

		this.vx = x / 4.0;
		this.vy = y / 4.0;

		this.rotationRate = this.rotationRateMin + Math.max(Math.abs(x), Math.abs(y)) * 2;
		if(this.rotationRate >= 360) this.rotationRate = 360;

		if(this.vx > 0) this.rortationDirection = 1;
		else this.rortationDirection = -1;
	}
	
	updateState() {

		//image
		this.currentSpriteTimer += this.deltaTime;

        if(this.currentSpriteTimer >= this.spriteInterval) {

            this.currentSpriteTimer = 0.0;

            let currentSprite = this.currentRow * this.columns + this.currentColumn;

            if (currentSprite >= this.spriteCount - 1) {

                this.currentColumn = 0;
                this.currentRow = 0;

            } else {				

				this.currentColumn++;
				if (this.currentColumn >= this.columns) {

					this.currentColumn = 0;
					this.currentRow++;
				}   
			}   
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

				this.sound_shield_down.currentTime = 0;
				this.sound_shield_down.play();

				//console.log("shield off!");
			}
		}

		//energy
		if(_GLOBAL.gameState == "Playing"){			

			if(this.energy > 0) {

				this.energy -= this.energyUsagePerSecond * this.deltaTime * _GLOBAL.multiplayers.energyDrain;

				if(this.energy <= 0) {

					this.energy = 0;
				}
			}
		}
    }

    render() {
		
		this.transform.startRotation();

			ctx.drawImage(
				this.spriteSheet, 

				this.currentColumn * this.singleSpriteWidth, 
				this.currentRow * this.singleSpriteHeight, 

				this.singleSpriteWidth, this.singleSpriteHeight, 

				this.transform.x - this.transform.width / 2, this.transform.y - this.transform.height / 2, 
				this.transform.width, this.transform.height
			);
        	// ctx.drawImage(
			// 	this.image_Ship
			// 	, this.transform.x - this.transform.width / 2
			// 	, this.transform.y - this.transform.width / 2
			// 	, this.transform.width
			// 	, this.transform.width
			// );

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