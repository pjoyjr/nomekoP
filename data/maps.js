const maps = {
    home: {
        name: 'home',
        offset: {
            x: -100,
            y: -325
        },
        mapWidth: 25,
        mapHeight: 25,
        backgroundImage: './img/maps/homeBackground.png',
        foregroundImage: './img/maps/homeForeground.png',
        mapData: homeMapData,
        transition2Map: {
            1: ['map1', true],
            2: ['map1', true, 'left']
        }
    },
    map1: {
        name: 'map1',
        offset: {
            x: -1000,
            y: -1318
        },
        mapWidth: 30,
        mapHeight: 30,
        backgroundImage: './img/maps/map1Background.png',
        foregroundImage: './img/maps/map1Foreground.png',
        mapData: map1Data,
        transition2Map: {
            1: ['', false]
        }
    }
}