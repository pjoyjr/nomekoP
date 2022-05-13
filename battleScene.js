//Create Battle Objects
const battleBackgroundImage = new Image()
battleBackgroundImage.src = "./img/battleBackground.png"
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

const emby = new Monster(monsters.Emby)

const draggle = new Monster(monsters.Draggle)

const renderedSprites = [draggle, emby]
emby.attacks.forEach((attack) => {
    const button = document.createElement('button')
    button.innerHTML = attack.name
    document.querySelector('#attacksBox').append(button)

})


function animateBattle() {
    const animateID = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}
animateBattle()

const queue = []

//Button Action Listener
document.querySelectorAll('button').forEach((button) => {
    button.addEventListener(('click'), (e) => {
        const selectedAttack = e.currentTarget.innerHTML
        emby.attack({
            attack: attacks[selectedAttack],
            recipient: draggle,
            renderedSprites
        })

        const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]
        queue.push(() => {
            draggle.attack({
                attack: randomAttack,
                recipient: emby,
                renderedSprites
            })
        })
    })
    button.addEventListener('mouseenter', (e) => {
        const selectAttack = attacks[e.currentTarget.innerHTML]
        document.querySelector('#attackType').innerHTML = selectAttack.type
        document.querySelector('#attackType').style.color = selectAttack.color

    })
    button.addEventListener('mouseleave', (e) => {
        const selectAttack = attacks[e.currentTarget.innerHTML]
        document.querySelector('#attackType').innerHTML = 'Attack Type'
        document.querySelector('#attackType').style.color = 'black'

    })
})

document.querySelector('#battleDialog').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'
})