const monsters = {
    Emby: {
        frames: {
            max: 4,
            hold: 25
        },
        animate: true,
        orderNumber: 4,
        name: 'Emby',
        hp: 60,
        type: 'Fire',
        attacks: [attacks.Tackle, attacks.Fireball]
    },
    Snake: {
        frames: {
            max: 4,
            hold: 25
        },
        animate: true,
        orderNumber: 10,
        name: 'Snake',
        hp: 40,
        type: 'Ground',
        attacks: [attacks.Tackle]
    },
    Octu: {
        frames: {
            max: 4,
            hold: 25
        },
        animate: true,
        orderNumber: 1,
        name: 'Octu',
        hp: 60,
        type: 'Water',
        attacks: [attacks.Tackle]
    },
    Draggle: {
        frames: {
            max: 4,
            hold: 25
        },
        animate: true,
        orderNumber: 7,
        name: 'Draggle',
        hp: 60,
        type: 'Grass',
        attacks: [attacks.Tackle]
    }

}