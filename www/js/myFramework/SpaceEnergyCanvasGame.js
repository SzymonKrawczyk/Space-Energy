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

        _GLOBAL.gameState = "Waiting";
        //console.log(_GLOBAL);
    }

    gameStart() {

        if (_GLOBAL.gameState == "Waiting") {

            _GLOBAL.gameState = "Playing";
            _GLOBAL.score = 0;

            
            // TODO reset game objects
            _scoreManager.reset();


            //test
            //setTimeout(() => {this.gameEnd()}, 4000);
        }

        //console.log(_GLOBAL);
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

        if(_GLOBAL.gameState == "Playing") {

            // asteroids & player
            for (let i = 0; i < _asteroidArray.arr.length; ++i) {

                let currentAsteroid = _asteroidArray.getObjectAt(i);

                if(currentAsteroid == null || typeof(currentAsteroid) == 'undefined') {
                    _asteroidArray.remove(currentAsteroid);
                    --i;
                    continue;
                }

                const distanceToPlayer = _player.transform.distanceToTransform(currentAsteroid.transform);
                const minimumDistanceToPlayer = _player.transform.width / 2.0 + currentAsteroid.transform.width / 2.0;

                if (distanceToPlayer <= minimumDistanceToPlayer) {
                    
                    _player.takeDamage();
                    currentAsteroid.takeDamage();
                    _asteroidArray.remove(currentAsteroid);

                    continue;
                }
            }
        }
    }
}