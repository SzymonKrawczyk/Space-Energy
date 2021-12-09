// Author: Szymon Krawczyk

class SoundManager extends GameObject {

    constructor(sound_background, sound_gameEnd) {

        super(null); 
        
        this.sound_background = sound_background;
        this.sound_gameEnd = sound_gameEnd;

        this.sound_background.volume = 0.5;

        this.backgroundStarted = false;

    }    

    startBackground() {

        if(this.backgroundStarted) return;
        
        this.backgroundStarted = true;
        this.sound_background.currentTime = 0;
        this.sound_background.play();

        /* ensure that the sound loops continuously */
        this.sound_background.addEventListener('ended', () =>  {

            this.sound_background.currentTime = 0;
            this.sound_background.play();
        });
    }

    playGameEndSound() {

        this.sound_gameEnd.currentTime = 0;
        this.sound_gameEnd.play();        
    }
}