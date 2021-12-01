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

        // HighScore object
        this.highScoreObject = {
              name: "Unknown"
            , score: -1
        };
    }

    start() {
        
        super.start(); // original gameObjects (background)

        _asteroidArray.start();
        _asteroidManager.start();
        _energyArray.start();
        _energyManager.start();

        _enemy.start();
        _player.start();

        _difficultyManager.start();

        _scoreManager.start();
        _uiArray.start();

        _soundManager.start();

        this.gameWait();
    }

    // Game loop:
    //  Loading -> Waiting -> Playing -> Game End Wait, Game End, Waiting -> Playing ...

    gameWait() {

        _GLOBAL.gameState = "Waiting";

        _playButton.show = true;
    }

    gameStart() {

        if (_GLOBAL.gameState == "Waiting") {

            _playButton.show = false;

            _GLOBAL.gameState = "Playing";
            _GLOBAL.score = 0;

            _scoreManager.reset();

            _enemy.startAI();
            _asteroidManager.startAI();
            _energyManager.startAI();
            
            setTimeout(() => {                
                _soundManager.startBackground();
            }, 1000);

            //test
            //setTimeout(() => {this.gameEnd()}, 4000);
        }
    }

    gameEnd() {

        if (_GLOBAL.gameState == "GameEndWait") {

            //console.log(this.highScoreObject);
            //alert(`${_GLOBAL.score}\n\rHighScore: ${this.highScoreObject.name} ${this.highScoreObject.score}`);

            if(this.highScoreObject.score < 0) {

                alert(`Your Score: ${_GLOBAL.score}\n\nNo internet connection!`);

            } else {

                if(_GLOBAL.score > this.highScoreObject.score) {

                    let playerName = prompt(`Your Score (new highScore!): ${_GLOBAL.score}\n\nPrevious highScore: ${this.highScoreObject.score} by ${this.highScoreObject.name}\n\nPlease enter your name:`, "Unknown");
                    if (playerName == null || playerName == "") playerName = "Unknown";

                    (async () => {
                        await window.Firebase.setDocument(playerName, _GLOBAL.score);
                    })();

                } else {

                    alert(`Your Score: ${_GLOBAL.score}\n\nHighScore: ${this.highScoreObject.score} by ${this.highScoreObject.name}`);
                }
            }

            _player.reset();
            _enemy.reset();
            _asteroidManager.reset();
            _energyManager.reset();

            _difficultyManager.reset();

            this.gameWait();            
        }
    }

    gameEndWait() {

        if (_GLOBAL.gameState == "Playing") {

            _GLOBAL.gameState = "GameEndWait";    

            _soundManager.playGameEndSound();

            (async () => {
                this.highScoreObject = await window.Firebase.getDocument();
            })();
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

        _asteroidManager.render();
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

            // enemy & player
            {
                const distanceToPlayer = _player.transform.distanceToTransform2(_enemy.transform);
                const minimumDistanceToPlayer = Math.pow(_player.transform.width / 2.0 + _enemy.transform.width * _enemy.hitboxMultiplayer / 2.0, 2.0);

                // hit
                if (distanceToPlayer <= minimumDistanceToPlayer) {
                        
                    if (!_player.isShieldActive){

                        _player.takeDamage();

                        // screenShake
                        this.shakeScreen(0.1);
                        // vibration
                        navigator.vibrate(100);
                    }
                }
            }

            // asteroids & player
            for (let i = 0; i < _asteroidArray.arr.length; ++i) {

                let currentAsteroid = _asteroidArray.getObjectAt(i);

                if(currentAsteroid == null || typeof(currentAsteroid) == 'undefined') {
                    _asteroidArray.remove(currentAsteroid);
                    --i;
                    continue;
                }

                if(!currentAsteroid.isActive) continue;

                const distanceToPlayer = _player.transform.distanceToTransform2(currentAsteroid.transform);
                const minimumDistanceToPlayer = Math.pow(_player.transform.width / 2.0 + currentAsteroid.transform.width * currentAsteroid.hitboxMultiplayer / 2.0, 2.0);

                // hit
                if (distanceToPlayer <= minimumDistanceToPlayer) {
                    
                    currentAsteroid.takeDamage();
                    //_asteroidArray.remove(currentAsteroid);

                    if (!_player.isShieldActive){

                        _player.takeDamage();

                        // screenShake
                        this.shakeScreen(0.1);
                        // vibration
                        navigator.vibrate(100);
                    }

                    continue;
                }
            }

            // asteroids & enemy
            for (let i = 0; i < _asteroidArray.arr.length; ++i) {

                let currentAsteroid = _asteroidArray.getObjectAt(i);

                if(currentAsteroid == null || typeof(currentAsteroid) == 'undefined') {
                    _asteroidArray.remove(currentAsteroid);
                    --i;
                    continue;
                }

                if(!currentAsteroid.isActive) continue;

                const distanceToEnemy = _enemy.transform.distanceToTransform2(currentAsteroid.transform);
                const minimumDistanceToEnemy = Math.pow(_enemy.transform.width / 2.0 + currentAsteroid.transform.width * currentAsteroid.hitboxMultiplayer / 2.0, 2.0);

                // hit
                if (distanceToEnemy <= minimumDistanceToEnemy) {
                    
                    currentAsteroid.takeDamage();
                    //_asteroidArray.remove(currentAsteroid);

                    continue;
                }
            }

            // asteroids despawn
            for (let i = 0; i < _asteroidArray.arr.length; ++i) {

                let currentAsteroid = _asteroidArray.getObjectAt(i);

                if(currentAsteroid == null || typeof(currentAsteroid) == 'undefined') {
                    _asteroidArray.remove(currentAsteroid);
                    --i;
                    continue;
                }

                let offScreen = false;
                if(currentAsteroid.movementHorizontal) {

                    if (Math.abs(currentAsteroid.transform.x - currentAsteroid.target.x) <= 25) offScreen = true;

                } else {

                    if (Math.abs(currentAsteroid.transform.y - currentAsteroid.target.y) <= 25) offScreen = true;
                }

                // off-screen
                if (offScreen) {
                    
                    currentAsteroid.destroy();
                    _asteroidArray.remove(currentAsteroid);

                    //console.log("Asteroid off-screen!");
                    //console.log(_asteroidArray);

                    continue;
                }
            }

            // energy & player
            for (let i = 0; i < _energyArray.arr.length; ++i) {

                let currentEnergy = _energyArray.getObjectAt(i);

                if(currentEnergy == null || typeof(currentEnergy) == 'undefined') {
                    _energyArray.remove(currentEnergy);
                    --i;
                    continue;
                }

                const distanceToPlayer = _player.transform.distanceToTransform2(currentEnergy.transform);
                const minimumDistanceToPlayer = Math.pow(_player.transform.width / 2.0 + currentEnergy.transform.width * currentEnergy.hitboxMultiplayer / 2.0, 2.0);

                // hit
                if (distanceToPlayer <= minimumDistanceToPlayer) {
                    
                    _player.collectEnergy(currentEnergy.value);
                    currentEnergy.collect();
                    _energyArray.remove(currentEnergy);

                    continue;
                }
            }

            // energy despawn
            for (let i = 0; i < _energyArray.arr.length; ++i) {

                let currentEnergy = _energyArray.getObjectAt(i);

                if(currentEnergy == null || typeof(currentEnergy) == 'undefined') {
                    _energyArray.remove(currentEnergy);
                    --i;
                    continue;
                }

                let offScreen = false;
                if(currentEnergy.movementHorizontal) {

                    if (Math.abs(currentEnergy.transform.x - currentEnergy.target.x) <= 25) offScreen = true;

                } else {

                    if (Math.abs(currentEnergy.transform.y - currentEnergy.target.y) <= 25) offScreen = true;
                }

                // off-screen
                if (offScreen) {
                    
                    currentEnergy.destroy();
                    _energyArray.remove(currentEnergy);

                    //console.log("Energy off-screen!");
                    //console.log(_energyArray);

                    continue;
                }
            }
        }
    }
}