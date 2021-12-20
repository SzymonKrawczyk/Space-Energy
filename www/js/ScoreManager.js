// Author: Szymon Krawczyk

class ScoreManager extends GameObject2 {

    constructor(scoreObject, highScoreObject) {

        super(8); 

        this.timerMax = 1.0;
        this.currentTime = 0.0;

        this.scoreObject = scoreObject;
        this.highScoreObject = highScoreObject;

        this.len = 1;

        this.reset();
    }

    reset() {

        let temp = "" + _GLOBAL.score;
        let missing = this.len - temp.length;

        for(let i = 0; i < missing; ++i) {
            temp = "0" + temp;
        }
        
        this.scoreObject.setText(temp);
        this.highScoreObject.setText(_GLOBAL.highScore);
    }

    updateState() {
		
        if (_GLOBAL.gameState == "Playing") {
            
            this.currentTime += this.deltaTime;

            if (this.currentTime >= this.timerMax) {

                this.currentTime = 0.0;

                ++_GLOBAL.score;

                if(_GLOBAL.score > _GLOBAL.highScore) {

                    _GLOBAL.highScore = _GLOBAL.score;
                    this.highScoreObject.setText(_GLOBAL.highScore);
                }

                let temp = "" + _GLOBAL.score;
                let missing = this.len - temp.length;

                for(let i = 0; i < missing; ++i) {
                    temp = "0" + temp;
                }
                this.scoreObject.setText(temp);
            }
        }
    }
}