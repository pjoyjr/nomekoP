class Map {
    constructor({
        player,
        name,
        offset,
        mapWidth,
        mapHeight,
        backgroundImage,
        foregroundImage,
        mapData,
        transition2Map
    }) {
        this.player = player

        this.name = name
        this.offset = offset
        this.mapWidth = mapWidth
        this.mapHeight = mapHeight
        this.backgroundImage = backgroundImage
        this.background = new Sprite({ position: offset })
        this.background.setImage(backgroundImage)
        this.foregroundImage = foregroundImage
        this.foreground = new Sprite({ position: offset })
        this.foreground.setImage(foregroundImage)


        this.mapData = mapData
        this.boundaries = []
        this.battleZones = []
        this.transitionZones = []
        this.createCollisionZones()
        this.transition2Map = transition2Map

        this.movables = [...this.boundaries, ...this.transitionZones, this.foreground, ...this.battleZones]

        this.battle = false
        this.transition = false
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

        this.wasd = {
            'w': {
                spriteImage: 'up',
                x: 0,
                y: 3
            },
            'a': {
                spriteImage: 'left',
                x: 3,
                y: 0
            },
            's': {
                spriteImage: 'down',
                x: 0,
                y: -3
            },
            'd': {
                spriteImage: 'right',
                x: -3,
                y: 0
            },
        }

        this.animationID
        this.moving = true
        this.setupMovementActionListeners()
    }

    setupMovementActionListeners() {

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

        document.querySelector('#dpadU').addEventListener('mousedown', () => {
            this.keys.w.pressed = true
            this.lastKey = 'w'
        })
        document.querySelector('#dpadL').addEventListener('mousedown', () => {
            this.keys.a.pressed = true
            this.lastKey = 'a'
        })
        document.querySelector('#dpadD').addEventListener('mousedown', () => {
            this.keys.s.pressed = true
            this.lastKey = 's'
        })
        document.querySelector('#dpadR').addEventListener('mousedown', () => {
            this.keys.d.pressed = true
            this.lastKey = 'd'
        })
        window.addEventListener('mouseup', () => {
            this.keys.w.pressed = false
            this.keys.a.pressed = false
            this.keys.s.pressed = false
            this.keys.d.pressed = false
        })

        //
        document.querySelector('#dpadU').addEventListener('touchstart', () => {
            this.keys.w.pressed = true
            this.lastKey = 'w'
        })
        document.querySelector('#dpadL').addEventListener('touchstart', () => {
            this.keys.a.pressed = true
            this.lastKey = 'a'
        })
        document.querySelector('#dpadD').addEventListener('touchstart', () => {
            this.keys.s.pressed = true
            this.lastKey = 's'
        })
        document.querySelector('#dpadR').addEventListener('touchstart', () => {
            this.keys.d.pressed = true
            this.lastKey = 'd'
        })
        window.addEventListener('touchend', () => {
            this.keys.w.pressed = false
            this.keys.a.pressed = false
            this.keys.s.pressed = false
            this.keys.d.pressed = false
        })
    }

    collisionTest({ rect1, rect2 }) {
        return (rect1.position.x + rect1.width >= rect2.position.x &&
            rect1.position.x <= rect2.position.x + rect2.width &&
            rect1.position.y <= rect2.position.y + rect2.height &&
            rect1.position.y + rect1.height >= rect2.position.y
        )
    }

    createCollisionZones() {
        const collisionsMap = []
        for (let i = 0; i < this.mapData.length; i += this.mapWidth) {
            collisionsMap.push(this.mapData.slice(i, this.mapWidth + i))
        }

        collisionsMap.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol === 1025) {
                    this.boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width + this.offset.x,
                                y: i * Boundary.height + this.offset.y
                            }
                        })
                    )

                } else if (symbol === 1026) {
                    this.battleZones.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width + this.offset.x,
                                y: i * Boundary.height + this.offset.y
                            }
                        })
                    )
                } else if (symbol >= 1 && symbol <= 10) {
                    this.transitionZones.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width + this.offset.x,
                                y: i * Boundary.height + this.offset.y
                            },
                            value: symbol
                        })
                    )
                }
            })
        })
    }

    playerMovement() {
        this.player.animate = false
        if ((this.keys.w.pressed && this.lastKey === 'w') ||
            (this.keys.a.pressed && this.lastKey === 'a') ||
            (this.keys.s.pressed && this.lastKey === 's') ||
            (this.keys.d.pressed && this.lastKey === 'd')) {
            this.player.setImage(this.player.sprites[this.wasd[this.lastKey].spriteImage])
            for (let i = 0; i < this.boundaries.length; i++) {
                const boundary = this.boundaries[i]
                if (
                    this.collisionTest({
                        rect1: this.player,
                        rect2: {...boundary,
                            position: {
                                x: boundary.position.x + this.wasd[this.lastKey].x,
                                y: boundary.position.y + this.wasd[this.lastKey].y
                            }
                        }
                    })
                ) {
                    this.moving = false
                    this.player.animate = false
                    break
                }
            }
            if (this.moving) {
                this.player.animate = true
                this.movables.forEach((movable) => {
                    movable.position.x += this.wasd[this.lastKey].x
                    movable.position.y += this.wasd[this.lastKey].y
                })
            }
        }
    }

    checkZones() {
        if ((this.keys.w.pressed || this.keys.a.pressed || this.keys.s.pressed || this.keys.d.pressed) && this.moving) {
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
                    this.battle = true
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
                                    initBattle('Octu', randomEnemy)
                                }
                            })
                        }
                    })
                    break
                }
            }
            for (let i = 0; i < this.transitionZones.length; i++) {
                const transitionZone = this.transitionZones[i]
                if (this.collisionTest({
                        rect1: this.player,
                        rect2: transitionZone
                    }) &&
                    avalMaps[currMapIndex].transition2Map[transitionZone.value][1] && !this.transition
                ) {
                    let xOffset = avalMaps[currMapIndex].transition2Map[transitionZone.value][3]
                    let yOffset = avalMaps[currMapIndex].transition2Map[transitionZone.value][4]
                    this.transition = true
                    window.cancelAnimationFrame(animationID)
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        duration: 0.4,
                        onComplete() {
                            gsap.to('#overlappingDiv', {
                                opacity: 0,
                                duration: 0.4
                            })
                            const nextMapName = avalMaps[currMapIndex].transition2Map[transitionZone.value][0]
                            const playerFacing = avalMaps[currMapIndex].transition2Map[transitionZone.value][2]
                            let j = 0
                            let found = false
                            for (j; j < avalMaps.length; j++) {
                                if (avalMaps[j].name === nextMapName && !found) {
                                    avalMaps[j].player.setImage(avalMaps[j].player.sprites[playerFacing])
                                    currMapIndex = j
                                    avalMaps[currMapIndex].transition = false
                                    found = true
                                }
                            }
                        }
                    })

                    this.movables.forEach((movable) => {
                        movable.position.x += xOffset
                        movable.position.y += yOffset
                    })
                    break
                }
            }
        }
    }

    animate() {

        let gamepads = navigator.getGamepads();

        for (let i = 0; i < gamepads.length; i++) {
            console.log("Gamepad " + i + ":");

            if (gamepads[i] === null) {
                console.log("[null]");
                continue;
            }

            if (!gamepads[i].connected) {
                console.log("[disconnected]");
                continue;
            }

            console.log("    Index: " + gamepads[i].index);
            console.log("    ID: " + gamepads[i].id);
            console.log("    Axes: " + gamepads[i].axes.length);
            console.log("    Buttons: " + gamepads[i].buttons.length);
            console.log("    Mapping: " + gamepads[i].mapping);
        }

        this.background.draw()
        this.boundaries.forEach(boundary => {
            boundary.draw()
        })
        this.battleZones.forEach(battleZone => {
            battleZone.draw()
        })
        this.transitionZones.forEach(transitionZone => {
            transitionZone.draw()
        })
        this.player.draw()
        this.foreground.draw()
        if (this.battle || this.transition) return
        this.checkZones()
        this.moving = true
        this.playerMovement()
    }

}