const monsters = {
    Emby: {
        image: {
            src: "./img/embySprite.png"
        },
        frames: {
            max: 4,
            hold: 25
        },
        animate: true,
        name: 'Emby',
        hp: 100,
        attacks: [attacks.Fireball]
    },
    Draggle: {
        image: {
            src: "./img/draggleSprite.png"
        },
        frames: {
            max: 4,
            hold: 25
        },
        animate: true,
        name: 'Draggle',
        hp: 100,
        attacks: [attacks.Tackle, attacks.Fireball]
    }

}