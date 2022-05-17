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
        transitionData: 'map1'
    },
    map1: {
        name: 'map1',
        offset: {
            x: 0,
            y: -325
        },
        mapWidth: 30,
        mapHeight: 30,
        backgroundImage: './img/maps/map1Background.png',
        foregroundImage: './img/maps/map1Foreground.png',
        mapData: map1Data,
        transitionData: 0
    }
}