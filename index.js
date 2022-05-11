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

//Create Collions Map
const collisionsMap = []
for (let i = 0; i < collisions.length; i += 30) {
    collisionsMap.push(collisions.slice(i, 30 + i))
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
const playerImage = new Image()
playerImage.src = './img/playerDown.png'

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: map1
})

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2,
    },
    image: playerImage,
    frames: {
        max: 4
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

const testBoundary = new Boundary({
    position: {
        x: 400,
        y: 400
    }
})

const movables = [background, testBoundary]

function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
        /*
        boundaries.forEach(boundary => {
            boundary.draw()
        })*/
    testBoundary.draw()
    player.draw()

    if (player.position.x + player.width >= testBoundary.position.x &&
        player.position.x <= testBoundary.position.x + testBoundary.width &&
        player.position.y <= testBoundary.position.y + testBoundary.height &&
        player.position.y + player.height >= testBoundary.position.y
    ) {
        console.log('colliding')
    }


    if (keys.w.pressed && lastKey === 'w') {
        movables.forEach((movable) => {
            movable.position.y += 3
        })
    } else if (keys.a.pressed && lastKey === 'a') {
        movables.forEach((movable) => {
            movable.position.x += 3
        })
    } else if (keys.s.pressed && lastKey === 's') {
        movables.forEach((movable) => {
            movable.position.y -= 3
        })
    } else if (keys.d.pressed && lastKey === 'd') {
        movables.forEach((movable) => {
            movable.position.x -= 3
        })
    }
}
animate()

//Action Listener
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