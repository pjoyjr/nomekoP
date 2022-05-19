const canvas = document.querySelector('canvas')
canvas.width = 1024
canvas.height = 576
const c = canvas.getContext('2d')
c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)


let animationID
    //CreatePlayer

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2,
    },
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: './img/playerUp.png',
        down: './img/playerDown.png',
        left: './img/playerLeft.png',
        right: './img/playerRight.png'
    }
})
player.setImage('./img/playerDown.png')


const homeMap = new Map({ player: player, ...maps.home })
const map1 = new Map({ player: player, ...maps.map1 })
let currMapIndex = 0
const avalMaps = [homeMap, map1]

function animateMap() {
    avalMaps[currMapIndex].animationID = window.requestAnimationFrame(animateMap)
    avalMaps[currMapIndex].animate()
}

animateMap()