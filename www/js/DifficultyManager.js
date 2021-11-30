// Author: Szymon Krawczyk

class DifficultyManager extends GameObject2 {

    constructor() {

        super(1); 

        this.currentTime = 0.0;

        this.currentPhase = 0;

        this.reset();
    }

    reset() {

        this.currentTime = 0.0;
        this.currentPhase = 0;
        console.log(`Phase: ${this.currentPhase}`);
        console.log(_GLOBAL.multiplayers);
        
        _GLOBAL.multiplayers.asteroidSpawn = 1.0;
        _GLOBAL.multiplayers.energySpawn   = 1.0;
        _GLOBAL.multiplayers.energyDrain   = 1.0;
        _GLOBAL.multiplayers.enemyWaiting  = 1.0;
    }

    updateState() {
		
        if (_GLOBAL.gameState == "Playing") {
            
            this.currentTime += this.deltaTime;

            if(this.currentTime >= 180) {

                if(this.currentPhase < 180) {

                    this.currentPhase = 180;
                    console.log(`Phase: ${this.currentPhase}`);
                    console.log(_GLOBAL.multiplayers);

                    _GLOBAL.multiplayers.asteroidSpawn = 1.8;
                    _GLOBAL.multiplayers.energySpawn   = 1.6;
                    _GLOBAL.multiplayers.energyDrain   = 1.5;
                    _GLOBAL.multiplayers.enemyWaiting  = 0.2;
                }
                 
            } else if(this.currentTime >= 120) {

                if(this.currentPhase < 120) {

                    this.currentPhase = 120;
                    console.log(`Phase: ${this.currentPhase}`);
                    console.log(_GLOBAL.multiplayers);

                    _GLOBAL.multiplayers.asteroidSpawn = 1.8;
                    _GLOBAL.multiplayers.energySpawn   = 1.35;
                    _GLOBAL.multiplayers.energyDrain   = 1.3;
                    _GLOBAL.multiplayers.enemyWaiting  = 0.4;
                }
                 
            } else if(this.currentTime >= 90) {

                if(this.currentPhase < 90) {

                    this.currentPhase = 90;
                    console.log(`Phase: ${this.currentPhase}`);
                    console.log(_GLOBAL.multiplayers);

                    _GLOBAL.multiplayers.asteroidSpawn = 1.6;
                    _GLOBAL.multiplayers.energySpawn   = 1.2;
                    _GLOBAL.multiplayers.energyDrain   = 1.2;
                    _GLOBAL.multiplayers.enemyWaiting  = 0.5;
                }
                 
            } else if(this.currentTime >= 60) {

                if(this.currentPhase < 60) {

                    this.currentPhase = 60;
                    console.log(`Phase: ${this.currentPhase}`);
                    console.log(_GLOBAL.multiplayers);

                    _GLOBAL.multiplayers.asteroidSpawn = 1.5;
                    _GLOBAL.multiplayers.energySpawn   = 1.1;
                    _GLOBAL.multiplayers.energyDrain   = 1.1;
                    _GLOBAL.multiplayers.enemyWaiting  = 0.7;
                }
                 
            } else if(this.currentTime >= 30) {

                if(this.currentPhase < 30) {

                    this.currentPhase = 30;
                    console.log(`Phase: ${this.currentPhase}`);
                    console.log(_GLOBAL.multiplayers);

                    _GLOBAL.multiplayers.asteroidSpawn = 1.3;
                    _GLOBAL.multiplayers.energySpawn   = 1.0;
                    _GLOBAL.multiplayers.energyDrain   = 1.0;
                    _GLOBAL.multiplayers.enemyWaiting  = 0.85;
                }
            }
        }
    }
}