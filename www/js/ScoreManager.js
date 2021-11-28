// Author: Szymon Krawczyk

class ScoreManager extends GameObject2 {

    constructor(scoreObject, len) {

        super(8); 

        this.timerMax = 1.0;
        this.currentTime = 0.0;

        this.scoreObject = scoreObject;

        this.len = len;

        this.reset();
    }

    reset() {

        let temp = "" + _GLOBAL.score;
        let missing = this.len - temp.length;

        for(let i = 0; i < missing; ++i) {
            temp = "0" + temp;
        }
        
        this.scoreObject.setText(temp);
    }

    updateState() {
		
        if (_GLOBAL.gameState == "Playing") {
            
            this.currentTime += this.deltaTime;

            if (this.currentTime >= this.timerMax) {

                this.currentTime = 0.0;

                ++_GLOBAL.score;

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