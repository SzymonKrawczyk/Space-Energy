// Author: Szymon Krawczyk

class SpaceEnergyCanvasGame extends CanvasGame {

    constructor() {

        super();
    }

    start() {
        
        super.start(); // original gameObjects (background)

        _asteroidArray.start();
        _energyArray.start();

        _enemy.start();
        _player.start();

        _scoreManager.start();
        _uiArray.start();

        this.gameWait();
    }

    // Game loop:
    //  Loading -> Waiting -> Playing -> Game End, Waiting -> Playing ...

    gameWait() {

        // TODO reset game objects

        _GLOBAL.gameState = "Waiting";
        console.log(_GLOBAL);
    }

    gameStart() {

        if (_GLOBAL.gameState == "Waiting") {

            _GLOBAL.gameState = "Playing";
            _GLOBAL.score = 0;

            _scoreManager.reset();

            //test
            //setTimeout(() => {this.gameEnd()}, 4000);
        }

        console.log(_GLOBAL);
    }

    gameEnd() {

        if (_GLOBAL.gameState == "Playing") {

            // TODO do some stuff with score, upload
            alert(_GLOBAL.score);

            this.gameWait();            
        }
    }

    render() {

        super.render(); // original gameObjects (background)

        _asteroidArray.render();
        _energyArray.render();

        _enemy.render();
        _player.render();

        _scoreManager.render();
        _uiArray.render();
    }
    
    collisionDetection() {

        //console.log(GLOBAL);
    }
}