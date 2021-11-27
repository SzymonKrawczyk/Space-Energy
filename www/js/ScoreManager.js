// Author: Szymon Krawczyk

class ScoreManager extends GameObject2 {

    constructor(scoreObject) {

        super(8); 

        this.timerMax = 1.0;
        this.currentTime = 0.0;

        this.scoreObject = scoreObject;
    }

    reset() {
        
        this.scoreObject.setText(_GLOBAL.score);
    }

    updateState() {
		
        if (_GLOBAL.gameState == "Playing") {
            
            this.currentTime += this.deltaTime;

            if (this.currentTime >= this.timerMax) {

                this.currentTime = 0.0;

                ++_GLOBAL.score;
                this.scoreObject.setText(_GLOBAL.score);
            }
        }
    }
}