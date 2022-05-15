const monsters = {
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
        attacks: [attacks.Tackle, attacks.Icicle]
    },
    Fiery: {
        frames: {
            max: 4,
            hold: 25
        },
        animate: true,
        orderNumber: 4,
        name: 'Fiery',
        hp: 60,
        type: 'Fire',
        attacks: [attacks.Tackle, attacks.Fireball]
    },
    Cricky: {
        frames: {
            max: 4,
            hold: 25
        },
        animate: true,
        orderNumber: 7,
        name: 'Cricky',
        hp: 60,
        type: 'Grass',
        attacks: [attacks.Tackle]
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
        attacks: [attacks.Tackle, attacks.Fireball]
    },
    Gardner: {
        frames: {
            max: 4,
            hold: 25
        },
        animate: true,
        orderNumber: 10,
        name: 'Gardner',
        hp: 40,
        type: 'Ground',
        attacks: [attacks.Tackle]
    },
    Owl: {
        frames: {
            max: 4,
            hold: 25
        },
        animate: true,
        orderNumber: 13,
        name: 'Owl',
        hp: 45,
        type: 'Flying',
        attacks: [attacks.Tackle]
    },
    Fishy: {
        frames: {
            max: 4,
            hold: 25
        },
        animate: true,
        orderNumber: 15,
        name: 'Fishy',
        hp: 35,
        type: 'Water',
        attacks: [attacks.Tackle]
    },
    Mousy: {
        frames: {
            max: 4,
            hold: 25
        },
        animate: true,
        orderNumber: 17,
        name: 'Mousy',
        hp: 30,
        type: 'Ground',
        attacks: [attacks.Tackle]
    }
}