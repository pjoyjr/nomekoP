//Create Battle Objects
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    }
})
battleBackground.setImage("./img/battleBackground.png")

let renderedSprites
let battleAnimationID
let myMonster, enemyMonster
let queue
let selectAttack

function initBattle(myGuy, oppGuy) {

    myMonster = new Monster(monsters[myGuy])
    myMonster.setIsEnemy(false)
    enemyMonster = new Monster(monsters[oppGuy])
    enemyMonster.setIsEnemy(true)

    battleBackground.opacity = 1
    document.querySelector('#battleUI').style.display = 'block'
    document.querySelector('#battleDialog').style.display = 'none'
    document.querySelector('#enemyHPBar').style.width = '100%'
    document.querySelector('#myHPBar').style.width = '100%'
    document.querySelector('#myMonsterName').innerHTML = myMonster.name
    document.querySelector('#myHPNum').innerHTML = myMonster.hp + ' / ' + monsters[myMonster.name].hp + ' HP'
    document.querySelector('#enemyMonsterName').innerHTML = enemyMonster.name
    document.querySelector('#enemyHPNum').innerHTML = enemyMonster.hp + ' / ' + monsters[enemyMonster.name].hp + ' HP'
    document.querySelector('#attacksBox').replaceChildren()

    renderedSprites = [enemyMonster, myMonster]
    queue = []

    //Create run option
    const runButton = document.querySelector('#runBtn')
    runButton.addEventListener(('click'), () => {
        audio.battle.stop()
        queue = []
        gsap.to(('#overlappingDiv'), {
            opacity: 1,
            onComplete: () => {
                cancelAnimationFrame(battleAnimationID)
                battleBackground.opacity = 0
                document.querySelector('#battleUI').style.display = 'none'
                document.querySelector('#dpad').style.display = 'block'

                avalMaps[currMapIndex].animate()
                gsap.to('#overlappingDiv', {
                    opacity: 0
                })
                avalMaps[currMapIndex].battle = false
                audio.map.play()
            }
        })
    })

    myMonster.attacks.forEach((attack) => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attacksBox').append(button)

        button.addEventListener('mouseenter', (e) => {
            selectAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#attackType').innerHTML = selectAttack.type
            document.querySelector('#attackType').style.color = selectAttack.color
        })
        button.addEventListener('mouseleave', (e) => {
            selectAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#attackType').innerHTML = 'Attack Type'
            document.querySelector('#attackType').style.color = 'black'

        })
        button.addEventListener(('click'), (e) => {
            const selectedAttack = e.currentTarget.innerHTML
            myMonster.attack({
                attack: attacks[selectedAttack],
                recipient: enemyMonster,
                renderedSprites
            })

            if (enemyMonster.hp <= 0) {
                queue.push(() => {
                    enemyMonster.faint()
                })

                queue.push(() => {
                    gsap.to(('#overlappingDiv'), {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationID)
                            avalMaps[currMapIndex].animate()
                            battleBackground.opacity = 0
                            document.querySelector('#battleUI').style.display = 'none'
                            document.querySelector('#dpad').style.display = 'block'

                            gsap.to('#overlappingDiv', {
                                opacity: 0
                            })
                            avalMaps[currMapIndex].battle = false
                            audio.map.play()
                        }
                    })
                })
            }
            //Enemy Attacks
            const randomAttack = enemyMonster.attacks[Math.floor(Math.random() * enemyMonster.attacks.length)]
            queue.push(() => {
                enemyMonster.attack({
                    attack: randomAttack,
                    recipient: myMonster,
                    renderedSprites
                })
                if (myMonster.hp <= 0) {
                    queue.push(() => {
                        myMonster.faint()
                    })
                    queue.push(() => {
                        gsap.to(('#overlappingDiv'), {
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationID)
                                battleBackground.opacity = 0
                                avalMaps[currMapIndex].animate()
                                document.querySelector('#dpad').style.display = 'block'
                                document.querySelector('#battleUI').style.display = 'none'

                                gsap.to('#overlappingDiv', {
                                    opacity: 0
                                })
                                avalMaps[currMapIndex].battle = false
                                audio.map.play()
                            }
                        })
                    })
                }
            })
        })
    })

    animateBattle()
}

function animateBattle() {
    battleAnimationID = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}

document.querySelector('#battleDialog').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'
})