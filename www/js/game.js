/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland.             */
/* There should always be a javaScript file with the same name as the html file. */
/* This file always holds the playGame function().                               */
/* It also holds game specific code, which will be different for each game       */

// Author: Szymon Krawczyk

/******************** Declare game specific global data and functions *****************/
/* images must be declared as global, so that they will load before the game starts   */

let image_spaceShipPlayer = new Image();
image_spaceShipPlayer.src = "img/spaceshooter/PNG/ufoBlue.png";
let image_shield = new Image();
image_shield.src = "img/myAssets/shield2.png";

let image_spaceShipEnemy = new Image();
image_spaceShipEnemy.src = "img/spaceshooter/PNG/ufoRed.png";
let image_shield_Enemy = new Image();
image_shield_Enemy.src = "img/myAssets/shieldRed3.png";

let image_bg = new Image();
image_bg.src = "img/spaceshooter/Backgrounds/black.png";

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


let image_energy = new Image();
image_energy.src = "img/myAssets/energy.png";

let _GLOBAL = {

      gameState: "Loading"
    , score: 0
}

_asteroidArray = null;
_energyArray = null;

_enemy = null;
_player = null;

_scoreManager = null;
_uiArray = null;
_playButton = null;

/******************* END OF Declare game specific data and functions *****************/

function playGame() {

    canvas.heightStart = 100;

    // moving background
    // gameObjects - objects that never reset (background)
    gameObjects.push(new MovingBackground(image_bg, 256, 256,   0,     -15, -5, 32));
    gameObjects.push(new MovingBackground(image_bg, 256, 256, 256 - 2, -15, -5, 32));
    gameObjects.push(new MovingBackground(image_bg, 256, 256, 512 - 4, -15, -5, 32));


    _asteroidArray = new GameObjectArray();
    
        //test
        _asteroidArray.add(new Asetroid(image_asteroids_array[3], canvas.width / 2, canvas.heightStart + 50, 50, 2.0, 32));
        _asteroidArray.add(new Asetroid(image_asteroids_array[0], canvas.width / 2, canvas.heightStart + 120, 90, 1.0, 32));

    _energyArray = new GameObjectArray();

        //test
        _energyArray.add(new Energy(image_energy, canvas.width / 2, canvas.height - 50, 40, 2.0, 32));

        
    _player = new Player(image_spaceShipPlayer, image_shield);

    _enemy = new Enemy(image_spaceShipEnemy, image_shield_Enemy, _player);


    _uiArray = new GameObjectArray();

    let statsBackground = new MovingStatsBackground(image_stats_bg, -15, -5, 32);
    _uiArray.add(statsBackground);
    const STATS_PADDING = 15;

	let scoreText = new InteractableText("SCORE", false, true, STATS_PADDING, STATS_PADDING, "monospace, sans-serif, serif", 30, "white");
    _uiArray.add(scoreText);
	let scoreVisualizer = new InteractableText(_GLOBAL.score, true, true, canvas.width - STATS_PADDING, STATS_PADDING, "monospace, sans-serif, serif", 30, "white");
	_uiArray.add(scoreVisualizer);
    _scoreManager = new ScoreManager(scoreVisualizer, 6);

    let energyVisualizer = new EnergyVisualizer(
        _player
        , image_energy_visual_bg, image_energy_visual_fg
        , canvas.heightStart - (STATS_PADDING + 30 / 2), STATS_PADDING, 30
        , 32);
	_uiArray.add(energyVisualizer);

    _playButton = new StaticImage(image_playButton, canvas.width / 2, ((canvas.height - canvas.heightStart) / 2.0) + canvas.heightStart, canvas.width - 150, canvas.width - 150);
	_uiArray.add(_playButton);

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
}
