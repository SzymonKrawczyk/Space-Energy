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

        _explosionArrray.start();

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

        _explosionArrray.render();

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

            // enemy (nothing) & player (take damage)
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

            // asteroids (destroy) & player (take damage)
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

            // asteroids (bounce) & asteroids (bounce)
            for (let i = 0; i < _asteroidArray.arr.length; ++i) {

                let currentAsteroid = _asteroidArray.getObjectAt(i);

                if(currentAsteroid == null || typeof(currentAsteroid) == 'undefined') {
                    _asteroidArray.remove(currentAsteroid);
                    --i;
                    continue;
                }

                if(!currentAsteroid.isActive) continue;

                for (let j = 0; j < _asteroidArray.arr.length; ++j) {

                    let otherAsteroid = _asteroidArray.getObjectAt(j);
    
                    if(otherAsteroid == null || typeof(otherAsteroid) == 'undefined') {
                        _asteroidArray.remove(otherAsteroid);
                        --j;
                        continue;
                    }

                    if(currentAsteroid == otherAsteroid) continue;    
                    if(!otherAsteroid.isActive) continue;

    
                    const distanceToAsteroid = currentAsteroid.transform.distanceToTransform2(otherAsteroid.transform);
                    const minimumDistanceToAsteroid = Math.pow(currentAsteroid.transform.width / 2.0 + otherAsteroid.transform.width * otherAsteroid.hitboxMultiplayer / 2.0, 2.0);
    
                    // hit
                    if (distanceToAsteroid <= minimumDistanceToAsteroid) {
                        
                        currentAsteroid.bounce();
                        otherAsteroid.bounce();
    
                        continue;
                    }
                }
            }

            // asteroids (nothing) & energy (bounce)
            for (let i = 0; i < _asteroidArray.arr.length; ++i) {

                let currentAsteroid = _asteroidArray.getObjectAt(i);

                if(currentAsteroid == null || typeof(currentAsteroid) == 'undefined') {
                    _asteroidArray.remove(currentAsteroid);
                    --i;
                    continue;
                }

                if(!currentAsteroid.isActive) continue;

                for (let j = 0; j < _energyArray.arr.length; ++j) {

                    let currentEnergy = _energyArray.getObjectAt(j);
    
                    if(currentEnergy == null || typeof(currentEnergy) == 'undefined') {
                        _energyArray.remove(currentEnergy);
                        --j;
                        continue;
                    }
    
                    const distance = currentAsteroid.transform.distanceToTransform2(currentEnergy.transform);
                    const minimumDistance = Math.pow(currentAsteroid.transform.width / 2.0 + currentEnergy.transform.width * currentEnergy.hitboxMultiplayer / 2.0, 2.0);
    
                    // hit
                    if (distance <= minimumDistance) {
                        
                        currentEnergy.bounce();
    
                        continue;
                    }
                }
            }

            // asteroids (destroy) & enemy (nothing)
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
                    //currentAsteroid.bounce();
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

                const top = canvas.heightStart - 400;
                const bottom = canvas.height + 400;
                const right = canvas.width + 400;
                const left = 0 - 400;

                const offScreen = (
                       Math.abs(currentAsteroid.transform.x - right)  < 50 
                    || Math.abs(currentAsteroid.transform.x - left)   < 50 
                    || Math.abs(currentAsteroid.transform.y - top)    < 50 
                    || Math.abs(currentAsteroid.transform.y - bottom) < 50
                );


                // off-screen
                if (offScreen) {
                    
                    currentAsteroid.destroy();
                    _asteroidArray.remove(currentAsteroid);

                    //console.log("Asteroid off-screen!");
                    //console.log(_asteroidArray);

                    continue;
                }
            }

            // energy (destroy) & player (collect)
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

            // energy (bounce) & energy (bounce)
            for (let i = 0; i < _energyArray.arr.length; ++i) {

                let currentEnergy = _energyArray.getObjectAt(i);

                if(currentEnergy == null || typeof(currentEnergy) == 'undefined') {
                    _energyArray.remove(currentEnergy);
                    --i;
                    continue;
                }

                for (let j = 0; j < _energyArray.arr.length; ++j) {

                    let otherEnergy = _energyArray.getObjectAt(j);
    
                    if(otherEnergy == null || typeof(otherEnergy) == 'undefined') {
                        _energyArray.remove(otherEnergy);
                        --j;
                        continue;
                    }

                    if(currentEnergy == otherEnergy) continue;  

    
                    const distanceToEnergy = currentEnergy.transform.distanceToTransform2(otherEnergy.transform);
                    const minimumDistanceToEnergy = Math.pow(currentEnergy.transform.width / 2.0 + otherEnergy.transform.width * otherEnergy.hitboxMultiplayer / 2.0, 2.0);
    
                    // hit
                    if (distanceToEnergy <= minimumDistanceToEnergy) {
                        
                        currentEnergy.bounce();
                        otherEnergy.bounce();
    
                        continue;
                    }
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

                const top = canvas.heightStart - 400;
                const bottom = canvas.height + 400;
                const right = canvas.width + 400;
                const left = 0 - 400;

                const offScreen = (
                       Math.abs(currentEnergy.transform.x - right)  < 50 
                    || Math.abs(currentEnergy.transform.x - left)   < 50 
                    || Math.abs(currentEnergy.transform.y - top)    < 50 
                    || Math.abs(currentEnergy.transform.y - bottom) < 50
                );

                // off-screen
                if (offScreen) {
                    
                    currentEnergy.destroy();
                    _energyArray.remove(currentEnergy);

                    //console.log("Energy off-screen!");

                    continue;
                }
            }
        }
    }
}