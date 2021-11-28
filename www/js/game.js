/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland.             */
/* There should always be a javaScript file with the same name as the html file. */
/* This file always holds the playGame function().                               */
/* It also holds game specific code, which will be different for each game       */

// Author: Szymon Krawczyk

/******************** Declare game specific global data and functions *****************/
/* images must be declared as global, so that they will load before the game starts  */

let image_spaceShipPlayer = new Image();
image_spaceShipPlayer.src = "img/spaceshooter/PNG/ufoBlue.png";

let image_shield = new Image();
image_shield.src = "img/myAssets/shield2.png";

let image_bg = new Image();
image_bg.src = "img/spaceshooter/Backgrounds/darkPurple.png";

let image_asteroids_array = [];
image_asteroids_array[0] = new Image();
image_asteroids_array[0].src = "img/spaceshooter/PNG/Meteors/meteorBrown_big3.png";
image_asteroids_array[1] = new Image();
image_asteroids_array[1].src = "img/spaceshooter/PNG/Meteors/meteorBrown_big4.png";
image_asteroids_array[2] = new Image();
image_asteroids_array[2].src = "img/spaceshooter/PNG/Meteors/meteorBrown_med1.png";
image_asteroids_array[3] = new Image();
image_asteroids_array[3].src = "img/spaceshooter/PNG/Meteors/meteorBrown_med3.png";

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

/******************* END OF Declare game specific data and functions *****************/

function playGame() {

    // moving background
    // gameObjects - objects that never reset (background)
    gameObjects.push(new MovingBackground(image_bg, 256, 256,   0,      -15, -5, 32));
    gameObjects.push(new MovingBackground(image_bg, 256, 256, 256 - 16, -15, -5, 32));
    gameObjects.push(new MovingBackground(image_bg, 256, 256, 512 - 16, -15, -5, 32));

    _asteroidArray = new GameObjectArray();
    
        //test
        _asteroidArray.add(new Asetroid(image_asteroids_array[3], canvas.width / 2, 50, 50, 2.0, 32));
        _asteroidArray.add(new Asetroid(image_asteroids_array[0], canvas.width / 2, 120, 90, 1.0, 32));

    _energyArray = new GameObjectArray();
    _uiArray = new GameObjectArray();
    
    _enemy = new GameObject();
    _player = new Player(image_spaceShipPlayer, image_shield);





	let scoreVisualizer = new InteractableText(_GLOBAL.score, 200, 50, "Calibri", 30, "darkorange");
	_uiArray.add(scoreVisualizer);
    _scoreManager = new ScoreManager(scoreVisualizer);


    console.log(_GLOBAL);

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
