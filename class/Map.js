class Map {
    constructor({
        player,
        offset,
        mapWidth,
        mapHeight,
        backgroundImage,
        foregroundImage,
        restrictedZonesData,
        battleZonesData
    }) {
        this.player = player
        this.offset = offset
        this.mapWidth = mapWidth
        this.mapHeight = mapHeight

        this.backgroundImage = backgroundImage
        this.background = new Sprite({ position: offset })
        this.background.setImage(backgroundImage)

        this.foregroundImage = foregroundImage
        this.foreground = new Sprite({ position: offset })
        this.foreground.setImage(foregroundImage)


        this.boundaries = []
        this.createRestrictedArea(restrictedZonesData)

        this.battleZones = []
        this.createBattleZones(battleZonesData)

        this.battle = { initiated: false }
        this.keys = {
            w: {
                pressed: false
            },
            a: {
                pressed: false
            },
            s: {
                pressed: false
            },
            d: {
                pressed: false
            }
        }
        this.lastKey = ''

        this.animationID = 0
        this.musicPlaying = false
        this.moving = true
        window.addEventListener('click', () => {
            if (!this.musicPlaying) {
                audio.map.play()
                this.musicPlaying = true
            }
        })
    }

    collisionTest({ rect1, rect2 }) {
        return (rect1.position.x + rect1.width >= rect2.position.x &&
            rect1.position.x <= rect2.position.x + rect2.width &&
            rect1.position.y <= rect2.position.y + rect2.height &&
            rect1.position.y + rect1.height >= rect2.position.y
        )
    }

    createBattleZones(battleZonesData) {
        const battleZonesMap = []
        for (let i = 0; i < battleZonesData.length; i += this.mapWidth) {
            battleZonesMap.push(battleZonesData.slice(i, this.mapWidth + i))
        }

        battleZonesMap.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol === 1025)
                    this.battleZones.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width + this.offset.x,
                                y: i * Boundary.height + this.offset.y
                            }
                        })
                    )
            })
        })

    }

    createRestrictedArea(restrictedZonesData) {
        const restrictedZones = []
        for (let i = 0; i < restrictedZonesData.length; i += this.mapWidth) {
            restrictedZones.push(restrictedZonesData.slice(i, this.mapWidth + i))
        }

        restrictedZones.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol === 1025)
                    this.boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width + this.offset.x,
                                y: i * Boundary.height + this.offset.y
                            }
                        })
                    )
            })
        })

    }

    playerMovement() {
        const movables = [...this.boundaries, this.foreground, ...this.battleZones]
        this.player.animate = false

        if (this.keys.w.pressed && this.lastKey === 'w') {
            this.player.animate = true
            this.player.setImage(this.player.sprites.up)
            for (let i = 0; i < this.boundaries.length; i++) {
                const boundary = this.boundaries[i]
                if (
                    this.collisionTest({
                        rect1: this.player,
                        rect2: {...boundary,
                            position: {
                                x: boundary.position.x,
                                y: boundary.position.y + 3
                            }
                        }
                    })
                ) {
                    this.moving = false
                    break
                }
            }
            if (this.moving) {
                movables.forEach((movable) => {
                    movable.position.y += 3
                })
            }
        } else if (this.keys.a.pressed && this.lastKey === 'a') {
            this.player.animate = true
            this.player.setImage(this.player.sprites.left)
            for (let i = 0; i < this.boundaries.length; i++) {
                const boundary = this.boundaries[i]
                if (
                    this.collisionTest({
                        rect1: this.player,
                        rect2: {...boundary,
                            position: {
                                x: boundary.position.x + 3,
                                y: boundary.position.y
                            }
                        }
                    })
                ) {
                    this.moving = false
                    break
                }
            }
            if (this.moving) {
                movables.forEach((movable) => {
                    movable.position.x += 3
                })
            }
        } else if (this.keys.s.pressed && this.lastKey === 's') {
            this.player.animate = true
            this.player.setImage(this.player.sprites.down)
            for (let i = 0; i < this.boundaries.length; i++) {
                const boundary = this.boundaries[i]
                if (
                    this.collisionTest({
                        rect1: this.player,
                        rect2: {...boundary,
                            position: {
                                x: boundary.position.x,
                                y: boundary.position.y - 3
                            }
                        }
                    })
                ) {
                    this.moving = false
                    break
                }
            }
            if (this.moving) {
                movables.forEach((movable) => {
                    movable.position.y -= 3
                })
            }
        } else if (this.keys.d.pressed && this.lastKey === 'd') {
            this.player.animate = true
            this.player.setImage(this.player.sprites.right)
            for (let i = 0; i < this.boundaries.length; i++) {
                const boundary = this.boundaries[i]
                if (
                    this.collisionTest({
                        rect1: this.player,
                        rect2: {...boundary,
                            position: {
                                x: boundary.position.x - 3,
                                y: boundary.position.y
                            }
                        }
                    })
                ) {
                    this.moving = false
                    break
                }
            }
            if (this.moving) {
                movables.forEach((movable) => {
                    movable.position.x -= 3
                })
            }
        }

        //Add dpad Listeners
        document.querySelector('#dpadU').addEventListener('mouseover', (e) => {
            this.keys.w.pressed = true
            this.lastKey = 'w'
        })
        document.querySelector('#dpadU').addEventListener('mouseout', (e) => {
            this.keys.w.pressed = false
        })
        document.querySelector('#dpadL').addEventListener('mouseover', (e) => {
            this.keys.a.pressed = true
            this.lastKey = 'a'
        })
        document.querySelector('#dpadL').addEventListener('mouseout', (e) => {
            this.keys.a.pressed = false
        })
        document.querySelector('#dpadD').addEventListener('mouseover', (e) => {
            this.keys.s.pressed = true
            this.lastKey = 's'
        })
        document.querySelector('#dpadD').addEventListener('mouseout', (e) => {
            this.keys.s.pressed = false
        })
        document.querySelector('#dpadR').addEventListener('mouseover', (e) => {
            this.keys.d.pressed = true
            this.lastKey = 'd'
        })
        document.querySelector('#dpadR').addEventListener('mouseout', (e) => {
            this.keys.d.pressed = false
        })


        //Add keyboard Listeners
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'w':
                    this.keys.w.pressed = true
                    this.lastKey = 'w'
                    break
                case 'a':
                    this.keys.a.pressed = true
                    this.lastKey = 'a'
                    break
                case 's':
                    this.keys.s.pressed = true
                    this.lastKey = 's'
                    break
                case 'd':
                    this.keys.d.pressed = true
                    this.lastKey = 'd'
                    break
            }
        })

        window.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'w':
                    this.keys.w.pressed = false
                    break
                case 'a':
                    this.keys.a.pressed = false
                    break
                case 's':
                    this.keys.s.pressed = false
                    break
                case 'd':
                    this.keys.d.pressed = false
                    break
            }
        })
    }

    checkBattleZones() {
        if (this.keys.w.pressed || this.keys.a.pressed || this.keys.s.pressed || this.keys.d.pressed) {
            for (let i = 0; i < this.battleZones.length; i++) {
                const battleZone = this.battleZones[i]
                const overlappingArea = (Math.min(this.player.position.x + this.player.width, battleZone.position.x + battleZone.width) - Math.max(this.player.position.x, battleZone.position.x)) * (Math.min(this.player.position.y + this.player.height, battleZone.position.y + battleZone.height) - Math.max(this.player.position.y, battleZone.position.y))

                if (this.collisionTest({
                        rect1: this.player,
                        rect2: battleZone
                    }) &&
                    overlappingArea > this.player.width * this.player.height / 2 &&
                    Math.random() < .004
                ) {
                    this.battle.initiated = true
                    this.moving = false
                    document.querySelector('#dpad').style.display = 'none'
                    window.cancelAnimationFrame(animationID)
                    audio.map.stop()
                    audio.initBattle.play()
                    audio.battle.play()
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        repeat: 3,
                        yoyo: true,
                        duration: 0.4,
                        onComplete() {
                            gsap.to('#overlappingDiv', {
                                opacity: 1,
                                duration: 0.4,
                                onComplete() {
                                    gsap.to('#overlappingDiv', {
                                        opacity: 0,
                                        duration: 0.4
                                    })

                                    const avalMonsters = Object.keys(monsters)
                                    const randomEnemy = avalMonsters[Math.floor(Math.random() * avalMonsters.length)]
                                    initBattle('Octu', randomEnemy, this)
                                }
                            })
                        }
                    })
                    break
                }
            }
        }
    }

    animate() {
        this.background.draw()
        this.boundaries.forEach(boundary => {
            boundary.draw()
        })
        this.battleZones.forEach(battleZone => {
            battleZone.draw()
        })
        this.player.draw()
        this.foreground.draw()
        if (this.battle.initiated) return
        this.checkBattleZones()
        this.moving = true
        this.playerMovement()
    }

}