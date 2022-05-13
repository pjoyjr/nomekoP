class Sprite {
    constructor({
        position,
        velocity,
        image,
        frames = { max: 1, hold: 10 },
        sprites,
        animate = false,
        hp = 100,
        isEnemy = false,
        rotation = 0
    }) {
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
        this.rotation = this.rotation
    }

    draw() {
        c.save()
        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
        c.rotate(this.rotation)
        c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2)
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

    attack({ attack, recipient, renderedSprites }) {
        let hpBar = '#enemyHPBar'
        let rotation = 1
        if (this.isEnemy) {
            hpBar = '#myHPBar'
            rotation = -2.5
        }

        this.hp -= attack.damage

        switch (attack.name) {
            case 'Fireball':
                const fireballImage = new Image()
                fireballImage.src = './img/fireball.png'
                const fireball = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: fireballImage,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true,
                    rotation
                })
                renderedSprites.splice(1, 0, fireball)


                const tl3 = gsap.timeline()
                gsap.to(fireball.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                        gsap.to(hpBar, {
                            width: this.hp - attack.damage + '%'
                        })
                        tl3.to(recipient.position, {
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
                        renderedSprites.splice(1, 1)
                    }
                })

                break
            case 'Tackle':
                const tl = gsap.timeline()
                const tl2 = gsap.timeline()

                let movementDistance = 20
                if (this.isEnemy) movementDistance = -20

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
                break
        }
    }

}