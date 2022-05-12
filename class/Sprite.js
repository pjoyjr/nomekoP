class Sprite {
    constructor({ position, velocity, image, frames = { max: 1, hold: 10 }, sprites, animate = false, hp = 100, isEnemy = false }) {
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0 }
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.animate = animate
        this.sprites = sprites
        this.opacity = 1
        this.hp = hp
        this.isEnemy = isEnemy
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )
        c.restore()

        if (!this.animate) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }
        if (this.frames.elapsed % this.frames.hold == 0) {
            if (this.frames.val < this.frames.max - 1) {
                this.frames.val++
            } else {
                this.frames.val = 0
            }
        }
    }

    attack({ attack, recipient }) {
        const tl = gsap.timeline()
        const tl2 = gsap.timeline()

        this.hp -= attack.damage

        let movementDistance = 20
        let hpBar = '#enemyHPBar'
        if (this.isEnemy) {
            movementDistance = -20
            hpBar = '#myHPBar'
        }

        //move for attack
        tl.to(this.position, {
            x: this.position.x - movementDistance
        }).to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: .1,
            onComplete: () => {
                //successful hit, move enemy and substract hp
                gsap.to(hpBar, {
                    width: this.hp - attack.damage + '%'

                })
                tl2.to(recipient.position, {
                    x: recipient.position.x + 15,
                    yoyo: true,
                    repeat: 2,
                    duration: .04,
                }).to(recipient.position, {
                    x: recipient.position.x,
                    yoyo: true,
                    repeat: 2,
                    duration: .04,
                }).to(recipient, {
                    opacity: 0,
                    repeat: 5,
                    yoyo: true,
                    duration: .08
                })
            }
        }).to(this.position, {
            x: this.position.x
        })
    }

}