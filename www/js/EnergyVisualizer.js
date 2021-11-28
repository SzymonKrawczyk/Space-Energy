// Author: Szymon Krawczyk

class EnergyVisualizer extends GameObject2 {

    constructor(player, image_bg, image_fg, y, paddingHorizontal, height, cps) {

        super(cps);

        this.player = player;

        this.image_bg = image_bg;
        this.image_fg = image_fg;
        
        this.transform.x = canvas.width / 2.0;
		this.transform.y = y;

		this.transform.width = canvas.width - paddingHorizontal * 2;
		this.transform.height = height;

        this.fill = 1.0;
    }

    updateState() { 

        this.fill = this.player.energy / this.player.energyMax;
    }

    render() {
        
        ctx.drawImage(
            this.image_bg
            , this.transform.x - this.transform.width / 2
            , this.transform.y - this.transform.height / 2
            , this.transform.width
            , this.transform.height
        );

        ctx.drawImage(
            this.image_fg
            , this.transform.x - this.transform.width / 2
            , this.transform.y - this.transform.height / 2
            , this.transform.width * this.fill
            , this.transform.height
        );
    }
}