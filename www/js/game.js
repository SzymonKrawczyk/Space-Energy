/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland.             */
/* There should always be a javaScript file with the same name as the html file. */
/* This file always holds the playGame function().                               */
/* It also holds game specific code, which will be different for each game       */

// Author: Szymon Krawczyk

/******************** Declare game specific global data and functions *****************/
/* Declared as global, so that they will load before the game starts */


/* Audio */
let sound_shield_up = new Audio();
sound_shield_up.src = "audio/spaceshooter/Bonus/sfx_shieldUp.ogg";
let sound_shield_down = new Audio();

sound_shield_down.src = "audio/spaceshooter/Bonus/sfx_shieldDown.ogg";
let sound_explosion = new Audio();
sound_explosion.src = "audio/sci-fi-sounds/Audio/explosionCrunch_000.ogg";

let sound_energy = new Audio();
sound_energy.src = "audio/spaceshooter/Bonus/sfx_zap.ogg";

let sound_background = new Audio();
sound_background.src = "audio/KevinMcLeod/PhantomFromSpace/Phantom_from_Space.mp3";
let sound_gameEnd = new Audio();
sound_gameEnd.src = "audio/spaceshooter/Bonus/sfx_lose.ogg";

/* Images */
let image_spaceShipPlayer = new Image();
//image_spaceShipPlayer.src = "img/spaceshooter/PNG/ufoBlue.png";
image_spaceShipPlayer.src = "img/myAssets/ufoBlueSheet3.png";
let image_shield = new Image();
image_shield.src = "img/myAssets/shield2.png";

let image_spaceShipEnemy = new Image();
image_spaceShipEnemy.src = "img/myAssets/enemy2.png";
//image_spaceShipEnemy.src = "img/spaceshooter/PNG/ufoRed.png";
//let image_shield_Enemy = new Image();
//image_shield_Enemy.src = "img/myAssets/shieldRed3.png";

let image_bg = new Image();
image_bg.src = "img/myAssets/black2.png";
//image_bg.src = "img/spaceshooter/Backgrounds/black.png";

let image_stats_bg = new Image();
image_stats_bg.src = "img/spaceshooter/Backgrounds/darkPurple.png";
let image_energy_visual_fg = new Image();
image_energy_visual_fg.src = "img/myAssets/energystatFG.png";
let image_energy_visual_bg = new Image();
image_energy_visual_bg.src = "img/myAssets/energystatBG.png";
let image_playButton = new Image();
image_playButton.src = "img/myAssets/play.png";

let image_asteroids_array = [];
image_asteroids_array[0] = new Image();
image_asteroids_array[0].src = "img/spaceshooter/PNG/Meteors/meteorBrown_big3.png";
image_asteroids_array[1] = new Image();
image_asteroids_array[1].src = "img/spaceshooter/PNG/Meteors/meteorBrown_big4.png";
image_asteroids_array[2] = new Image();
image_asteroids_array[2].src = "img/spaceshooter/PNG/Meteors/meteorBrown_med1.png";
image_asteroids_array[3] = new Image();
image_asteroids_array[3].src = "img/spaceshooter/PNG/Meteors/meteorBrown_med3.png";

let image_asteroidWarning = new Image();
image_asteroidWarning.src = "img/myAssets/warning.png";

let image_explosion = new Image();
image_explosion.src = "img/other/explosionSheet.png";

//let image_energy = new Image();
//image_energy.src = "img/myAssets/energy.png";
//image_energy.src = "img/spaceshooter/PNG/Lasers/laserBlue10.png";
let image_energy_array = [];
image_energy_array[0] = new Image();
image_energy_array[0].src = "img/spaceshooter/PNG/Lasers/laserBlue10.png";
image_energy_array[1] = new Image();
image_energy_array[1].src = "img/spaceshooter/PNG/Lasers/laserGreen16.png";



/* global game variables */
let _GLOBAL = {

      gameState: "Loading"
    , score: 0
    , highScore: window.localStorage.getItem('highScore') ? window.localStorage.getItem('highScore') : 0
    , multiplayers: {
          asteroidSpawn: 1.0
        , energySpawn:   1.0
        , energyDrain:   1.0
        , enemyWaiting:  1.0
    }
}

/* global game objects */
_asteroidArray = null;
_asteroidManager = null;
_explosionArrray = null;
_energyArray = null;
_energyManager = null;

_enemy = null;
_player = null;

_difficultyManager = null

_scoreManager = null;
_levelText = null;
_uiArray = null;
_playButton = null;

_soundManager = null

/******************* END OF Declare game specific data and functions *****************/

function playGame() {

    canvas.heightStart = 125;

    // moving background
    // gameObjects - objects that never reset (background)
    gameObjects.push(new MovingBackground(image_bg, 256, 256,   0,     -10, -5, 32));
    gameObjects.push(new MovingBackground(image_bg, 256, 256, 256 - 2, -10, -5, 32));
    gameObjects.push(new MovingBackground(image_bg, 256, 256, 512 - 4, -10, -5, 32));


    _asteroidArray = new GameObjectArray();
    _asteroidManager = new AsteroidManager(image_asteroids_array);

    _explosionArrray = new GameObjectArray();
    

    _energyArray = new GameObjectArray();
    _energyManager = new EnergyManager(image_energy_array, sound_energy);


    _player = new Player(image_spaceShipPlayer, image_shield, sound_shield_up, sound_shield_down);

    _enemy = new Enemy(image_spaceShipEnemy,/* image_shield_Enemy,*/ _player);

    _soundManager = new SoundManager(sound_background, sound_gameEnd);

    _uiArray = new GameObjectArray();
    const UI_PADDING = 15;

    let statsBackground = new MovingStatsBackground(image_stats_bg, -15, -5, 32);
    _uiArray.add(statsBackground);

    let levelLabel = new InteractableText("LEVEL", false, true, UI_PADDING, UI_PADDING, "monospace, sans-serif, serif", 30, "white");
    _uiArray.add(levelLabel);
    _levelText = new InteractableText("  1", false, false, UI_PADDING, canvas.heightStart - (UI_PADDING * 2 + UI_PADDING * 2), "monospace, sans-serif, serif", 30, "white");
    _uiArray.add(_levelText);

    let highScoreLabel = new InteractableText("RECORD", false, true, (canvas.width + UI_PADDING) / 3, UI_PADDING, "monospace, sans-serif, serif", 30, "white");
    _uiArray.add(highScoreLabel);
    let highScoreText = new InteractableText(_GLOBAL.highScore, true, true, canvas.width - UI_PADDING, UI_PADDING, "monospace, sans-serif, serif", 30, "white");
    _uiArray.add(highScoreText);

	let scoreLabel = new InteractableText("TIME", false, false, (canvas.width + UI_PADDING) / 3, canvas.heightStart - (UI_PADDING * 2 + UI_PADDING * 2), "monospace, sans-serif, serif", 30, "white");
    _uiArray.add(scoreLabel);
	let scoreVisualizer = new InteractableText(_GLOBAL.score, true, false, canvas.width - UI_PADDING, canvas.heightStart - (UI_PADDING * 2 + UI_PADDING * 2), "monospace, sans-serif, serif", 30, "white");
	_uiArray.add(scoreVisualizer);
    _scoreManager = new ScoreManager(scoreVisualizer, highScoreText);

    let energyVisualizer = new EnergyVisualizer(
        _player
        , image_energy_visual_bg, image_energy_visual_fg
        , canvas.heightStart - (UI_PADDING + 30 / 2), UI_PADDING, UI_PADDING * 2
        , 32);
	_uiArray.add(energyVisualizer);

    _playButton = new StaticImage(image_playButton, canvas.width / 2, ((canvas.height - canvas.heightStart) / 2.0) + canvas.heightStart, canvas.width - 150, canvas.width - 150);
	_uiArray.add(_playButton);

    
    _difficultyManager = new DifficultyManager();

    /* Always create a game that uses the gameObject array */
    let game = new SpaceEnergyCanvasGame();

    /* Always play the game */
    game.start();

    // Listeners
    // Accelerometer for player movement
    window.addEventListener("deviceorientation", (event) => {
		
		_player.setOrientation(event.gamma, event.beta);
	});

    // Start / reset game
    document.getElementById('gameCanvas').addEventListener("touchstart", (event)=>{

        if (_GLOBAL.gameState == "Waiting") {

            game.gameStart();
        }
    });

    // Debug
    document.addEventListener("keydown", function (e)
    {
        if (e.keyCode === 37)  // left
        {
            _player.setOrientation(-45, 0);
        }
        else if (e.keyCode === 38) // up
        {
            _player.setOrientation(0.00001, -45);
        }
        else if (e.keyCode === 39) // right
        {
            _player.setOrientation(45, 0);
        }
        else if (e.keyCode === 40) // down
        {
            _player.setOrientation(-0.00001, 45);
        } 
        else if (e.keyCode === 82) // r
        {
            _GLOBAL.highScore = 0;
            window.localStorage.setItem('highScore', _GLOBAL.highScore);
            highScoreText.setText(_GLOBAL.highScore);
        }
    });
}