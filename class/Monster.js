class Monster extends Sprite {
    constructor({
        frames = { max: 1, hold: 10 },
        sprites,
        animate = false,
        rotation = 0,
        orderNumber,
        name,
        hp = 100,
        type,
        attacks,
        isEnemy
    }) {
        super({
            frames,
            sprites,
            animate,
            rotation
        })
        this.orderNumber = orderNumber
        this.name = name
        this.hp = hp
        this.type = type
        this.isEnemy = isEnemy
        this.attacks = attacks
    }
    setIsEnemy(isEnemy) {
        this.isEnemy = isEnemy

        let position
        let image
        if (isEnemy) {
            image = 'img/monsters/' + this.name + 'Front.png'
            position = {
                x: 800,
                y: 100
            }
            super.setPosition(position)
            super.setImage(image)
        } else {
            image = 'img/monsters/' + this.name + 'Back.png'
            position = {
                x: 280,
                y: 325
            }
            super.setPosition(position)
            super.setImage(image)
        }
    }
    faint() {
        audio.battle.stop()
        if (this.isEnemy) {
            audio.victory.play()

        } else {
            audio.loss.play()
        }
        document.querySelector('#battleDialog').innerHTML = this.name + ' fainted!'
        gsap.to(this.position, {
            y: this.position.y + 20
        })
        gsap.to(this, {
            opacity: 0
        })
    }

    attack({ attack, recipient, renderedSprites }) {
        document.querySelector('#battleDialog').style.display = 'block'
        document.querySelector('#battleDialog').innerHTML = this.name + ' used ' + attack.name

        let hpBar = '#enemyHPBar'
        let rotation = 1
        if (this.isEnemy) {
            hpBar = '#myHPBar'
            rotation = -2.5
        }

        recipient.hp -= attack.damage
        if (recipient.hp < 0) recipient.hp = 0

        let newHPPercentage
        switch (attack.name) {
            case 'Fireball':
                audio.initFireball.play()
                const fireball = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true,
                    rotation
                })
                fireball.setImage('./img/fireball.png')
                renderedSprites.splice(1, 0, fireball)
                newHPPercentage = recipient.hp / (monsters[recipient.name].hp) * 100
                const tl3 = gsap.timeline()
                gsap.to(fireball.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                        audio.fireballHit.play()
                        gsap.to(hpBar, {
                            width: newHPPercentage + '%'
                        })
                        if (recipient.isEnemy) {
                            document.querySelector('#enemyHPNum').innerHTML = recipient.hp + ' / ' + monsters[recipient.name].hp + ' HP'
                        } else {
                            document.querySelector('#myHPNum').innerHTML = recipient.hp + ' / ' + monsters[recipient.name].hp + ' HP'
                        }
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
                newHPPercentage = recipient.hp / (monsters[recipient.name].hp) * 100
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
                        audio.tackleHit.play()
                        gsap.to(hpBar, {
                            width: newHPPercentage + '%'

                        })
                        if (recipient.isEnemy) {
                            document.querySelector('#enemyHPNum').innerHTML = recipient.hp + ' / ' + monsters[recipient.name].hp + ' HP'
                        } else {
                            document.querySelector('#myHPNum').innerHTML = recipient.hp + ' / ' + monsters[recipient.name].hp + ' HP'
                        }
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