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

        _levelText.setText("  1");
        
        this.setDifficulty(1.0, 1.0, 1.0, 1.0);
    }

    setDifficulty(asteroidSpawn, energySpawn, energyDrain, enemyWaiting) {

        _GLOBAL.multiplayers.asteroidSpawn = asteroidSpawn;
        _GLOBAL.multiplayers.energySpawn   = energySpawn;
        _GLOBAL.multiplayers.energyDrain   = energyDrain;
        _GLOBAL.multiplayers.enemyWaiting  = enemyWaiting;
    }

    updateState() {
		
        if (_GLOBAL.gameState == "Playing") {
            
            this.currentTime += this.deltaTime;

            if(this.currentTime >= 180) {

                if(this.currentPhase < 180) {

                    this.currentPhase = 180;
                    console.log(`Phase: ${this.currentPhase}`);

                    _levelText.setText(" MAX");

                    this.setDifficulty(2.5, 2.0, 2.0, 0.2);
                    console.log(_GLOBAL.multiplayers);
                }
                 
            } else if(this.currentTime >= 130) {

                if(this.currentPhase < 130) {

                    this.currentPhase = 130;
                    console.log(`Phase: ${this.currentPhase}`);

                    _levelText.setText("  5");

                    this.setDifficulty(1.9, 1.75, 1.75, 0.35);
                    console.log(_GLOBAL.multiplayers);
                }
                 
            } else if(this.currentTime >= 90) {

                if(this.currentPhase < 90) {

                    this.currentPhase = 90;
                    console.log(`Phase: ${this.currentPhase}`);

                    _levelText.setText("  4");

                    this.setDifficulty(1.75, 1.6, 1.6, 0.5);
                    console.log(_GLOBAL.multiplayers);
                }
                 
            } else if(this.currentTime >= 60) {

                if(this.currentPhase < 60) {

                    this.currentPhase = 60;
                    console.log(`Phase: ${this.currentPhase}`);

                    _levelText.setText("  3");

                    this.setDifficulty(1.65, 1.4, 1.4, 0.6);
                    console.log(_GLOBAL.multiplayers);
                }
                 
            } else if(this.currentTime >= 30) {

                if(this.currentPhase < 30) {

                    this.currentPhase = 30;
                    console.log(`Phase: ${this.currentPhase}`);

                    _levelText.setText("  2");

                    this.setDifficulty(1.6, 1.2, 1.2, 0.8);
                    console.log(_GLOBAL.multiplayers);
                }
            }
        }
    }
}