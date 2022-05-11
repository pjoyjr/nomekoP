const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const map1 = new Image()
map1.src = './img/map1.png'

const playerImage = new Image()
playerImage.src = './img/playerDown.png'

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

map1.onload = () => {
    c.drawImage(map1, 0, -300)
}

playerImage.onload = () => {
    c.drawImage(
        playerImage,
        0,
        0,
        playerImage.width / 4,
        playerImage.height,
        canvas.width / 2 - (playerImage.width / 4) / 2,
        canvas.height / 2 - playerImage.height / 2,
        playerImage.width / 4,
        playerImage.height
    )
}

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            break
        case 'a':
            break
        case 's':
            break
        case 'd':
            break
    }
})