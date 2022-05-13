const canvas = document.querySelector('canvas')
canvas.width = 1024
canvas.height = 576
const c = canvas.getContext('2d')
c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

//Offset for start position
const offset = {
    x: 0,
    y: -325
}

//Create Battle Zones Map
const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 30) {
    battleZonesMap.push(battleZonesData.slice(i, 30 + i))
}

const battleZones = []
battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            battleZones.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})

//Create Collions Map
const collisionsMap = []
for (let i = 0; i < collisionsData.length; i += 30) {
    collisionsMap.push(collisionsData.slice(i, 30 + i))
}

const boundaries = []
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})

//Create Map and Player
const map1 = new Image()
map1.src = './img/map1.png'
const foregroundImage = new Image()
foregroundImage.src = './img/foreground.png'

const playerDownImage = new Image()
const playerUpImage = new Image()
const playerLeftImage = new Image()
const playerRightImage = new Image()
playerDownImage.src = './img/playerDown.png'
playerUpImage.src = './img/playerUp.png'
playerLeftImage.src = './img/playerLeft.png'
playerRightImage.src = './img/playerRight.png'

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: map1
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2,
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage
    }
})

//keystrokes for actionlistener
const keys = {
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


const movables = [background, ...boundaries, foreground, ...battleZones]

function collistionTest({ rect1, rect2 }) {
    return (rect1.position.x + rect1.width >= rect2.position.x &&
        rect1.position.x <= rect2.position.x + rect2.width &&
        rect1.position.y <= rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height >= rect2.position.y
    )
}

const battle = {
    initiated: false
}

function animate() {
    const animationID = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    battleZones.forEach(battleZone => {
        battleZone.draw()
    })
    player.draw()
    foreground.draw()

    let moving = true
    player.animate = false

    if (battle.initiated) return

    //Start a battle
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - Math.max(player.position.x, battleZone.position.x)) * (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) - Math.max(player.position.y, battleZone.position.y))

            if (collistionTest({
                    rect1: player,
                    rect2: battleZone
                }) &&
                overlappingArea > player.width * player.height / 2 &&
                Math.random() < .004
            ) {
                window.cancelAnimationFrame(animationID)
                battle.initiated = true
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
                                initBattle()
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.4
                                })
                            }
                        })
                    }
                })
                break
            }
        }
    }

    if (keys.w.pressed && lastKey === 'w') {
        player.animate = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                collistionTest({
                    rect1: player,
                    rect2: {...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })
            ) {
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.y += 3
            })
        }
    } else if (keys.a.pressed && lastKey === 'a') {
        player.animate = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                collistionTest({
                    rect1: player,
                    rect2: {...boundary,
                        position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.x += 3
            })
        }
    } else if (keys.s.pressed && lastKey === 's') {
        player.animate = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                collistionTest({
                    rect1: player,
                    rect2: {...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                })
            ) {
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.y -= 3
            })
        }
    } else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                collistionTest({
                    rect1: player,
                    rect2: {...boundary,
                        position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                moving = false
                break
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.x -= 3
            })
        }
    }
}

animate()

//Key Action Listener
let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})