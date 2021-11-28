// Author: Szymon Krawczyk

class SpaceEnergyCanvasGame extends CanvasGame {

    constructor() {

        super();

        this.gameEndWaitTime = 4;

        // Screenshake
        this.screenShakeInterval = null;
        this.ScreenRotationDirectionToggle = false;
        this.SCREEN_SHAKES_PER_SECOND = 100;
        this.screenShakesLeft = 0;
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
    //  Loading -> Waiting -> Playing -> Game End Wait, Game End, Waiting -> Playing ...

    gameWait() {

        _GLOBAL.gameState = "Waiting";
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
    }

    gameEnd() {

        if (_GLOBAL.gameState == "GameEndWait") {

            // TODO do some stuff with score, upload
            alert(_GLOBAL.score);

            _player.reset();

            this.gameWait();            
        }
    }

    gameEndWait() {

        if (_GLOBAL.gameState == "Playing") {

            _GLOBAL.gameState = "GameEndWait";    
            setTimeout(() => {this.gameEnd()}, 1000 * this.gameEndWaitTime);
        }
    }

    render() {

        ctx.save();
        if (this.screenShakeInterval !== null) {
            
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(Math.radians(1 * (this.ScreenRotationDirectionToggle ? -1 : 1)));
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }

        super.render(); // original gameObjects (background)

        _asteroidArray.render();
        _energyArray.render();

        _enemy.render();
        _player.render();

        _scoreManager.render();
        _uiArray.render();

        
        ctx.restore();
    }

    shaker() {

        this.ScreenRotationDirectionToggle = !this.ScreenRotationDirectionToggle;
        --this.screenShakesLeft;
        if (this.screenShakesLeft <= 0) {

            this.screenShakesLeft = 0;
            clearInterval(this.screenShakeInterval);
            this.screenShakeInterval = null;
        }
    }

    shakeScreen(duration) {

        this.screenShakesLeft += Math.floor(duration * this.SCREEN_SHAKES_PER_SECOND);

        if (this.screenShakeInterval === null) {

            this.screenShakeInterval = setInterval(this.shaker.bind(this), Math.floor(1000 / this.SCREEN_SHAKES_PER_SECOND));
        }
    }
    
    collisionDetection() {

        if(_GLOBAL.gameState == "Playing") {

            // gameOverCheck
            if(_player.energy <= 0) {

                this.gameEndWait();
                return;
            }

            // asteroids & player
            for (let i = 0; i < _asteroidArray.arr.length; ++i) {

                let currentAsteroid = _asteroidArray.getObjectAt(i);

                if(currentAsteroid == null || typeof(currentAsteroid) == 'undefined') {
                    _asteroidArray.remove(currentAsteroid);
                    --i;
                    continue;
                }

                const distanceToPlayer = _player.transform.distanceToTransform(currentAsteroid.transform);
                const minimumDistanceToPlayer = _player.transform.width / 2.0 + currentAsteroid.transform.width * currentAsteroid.hitboxMultiplayer / 2.0;

                // hit
                if (distanceToPlayer <= minimumDistanceToPlayer) {
                    
                    _player.takeDamage();
                    currentAsteroid.takeDamage();
                    _asteroidArray.remove(currentAsteroid);

                    // screenShake
                    this.shakeScreen(0.1);
                    // vibration
                    navigator.vibrate(100);

                    continue;
                }
            }

            // energy & player
            for (let i = 0; i < _energyArray.arr.length; ++i) {

                let currentEnergy = _energyArray.getObjectAt(i);

                if(currentEnergy == null || typeof(currentEnergy) == 'undefined') {
                    _asteroidArray.remove(currentEnergy);
                    --i;
                    continue;
                }

                const distanceToPlayer = _player.transform.distanceToTransform(currentEnergy.transform);
                const minimumDistanceToPlayer = _player.transform.width / 2.0 + currentEnergy.transform.width / 2.0;

                // hit
                if (distanceToPlayer <= minimumDistanceToPlayer) {
                    
                    _player.collectEnergy(currentEnergy.value);
                    currentEnergy.collect();
                    _energyArray.remove(currentEnergy);

                    continue;
                }
            }


        }
    }
}