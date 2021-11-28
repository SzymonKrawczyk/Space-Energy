// Author: Szymon Krawczyk

class InteractableText extends GameObject {

    constructor(text, alignRight, alignTop, x, y, font, size, color) {
        super(null);

        this.text = text;
        this.x = x;
        this.y = y;
        this.font = font;
        this.size = size;
        this.color = color;

        this.alignRight = alignRight;
        this.alignTop = alignTop;
    }

    setText(text) {

        this.text = text;
    }

    render() {
        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px ${this.font}`;

        let width = ctx.measureText(this.text).width;
        let tempX = this.x;
        if (this.alignRight) {
            tempX -= width;
        }

        let height = ctx.measureText(this.text).actualBoundingBoxAscent;
        let tempY = this.y;
        if (this.alignTop) {
            tempY += height;
        }
        ctx.fillText(this.text, tempX, tempY);

        //console.log(this.text);
        //console.log(ctx.measureText(this.text));
        //console.log(tempX);
        //console.log(tempY);
    }
}