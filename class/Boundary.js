class Boundary {
    static width = 72 //12px times 6 (600%) zoom
    static height = 72
    constructor({ position }) {
        this.position = position,
            this.width = 72,
            this.height = 72
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}