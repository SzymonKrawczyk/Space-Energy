// Author: Szymon Krawczyk

class GameObjectArray extends GameObject{

    constructor() {
        
        super(null, 0);

        this.gameObjectIsDisplayed = true;

        this.arr = [];
    }

    add(newObject) {

        this.arr.push(newObject);
    }

    removeAt(index) {

        this.arr.splice(index, 1);
    }

    remove(oldObject) {

        let index = this.getIndex(oldObject);
        if(index === -1) return false;

        this.removeAt(index);
        return true;
    }

    getIndex(searchObject) {

        for(let i = 0; i < this.arr.length; ++i) {
            if(this.arr[i] == searchObject) return i;
        }
        return -1;
    }

    getObjectAt(index) {

        return this.arr[index];
    }

    start() {

        for(let i = 0; i < this.arr.length; ++i) {
            this.arr[i].start();
        }
    }

    render() {
        for(let i = 0; i < this.arr.length; ++i) {
            this.arr[i].render();
        }
    }

    stop() {

        for(let i = 0; i < this.arr.length; ++i) {
            this.arr[i].stop();
        }
    }

    stopAndHide() {

        for(let i = 0; i < this.arr.length; ++i) {
            this.arr[i].stopAndHide();
        }
    }

    isDisplayed() {
        return (this.gameObjectIsDisplayed);
    }

}