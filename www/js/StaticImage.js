
class StaticImage extends GameObject {

    constructor(image, x, y, width, height) {

        super(null); 

        this.image = image;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;

        this.show = true;
    }

    render() {

        if(this.show) ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
}