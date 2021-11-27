// Author: Szymon Krawczyk

class InteractableText extends GameObject {

    constructor(text, x, y, font, size, color) {
        super(null);

        this.text = text;
        this.x = x;
        this.y = y;
        this.font = font;
        this.size = size;
        this.color = color;
    }

    setText(text) {
        this.text = text;
    }

    render() {
        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px ${this.font}`;
        ctx.fillText(this.text, this.x, this.y);
    }
}