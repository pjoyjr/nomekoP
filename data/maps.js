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
            1: ['oldManHome', true, 'up', 0, -6],
            2: ['map1', true, 'left', 6, 0]
        }
    },
    oldManHome: {
        name: 'oldManHome',
        offset: {
            x: -208,
            y: -670
        },
        mapWidth: 24,
        mapHeight: 18,
        backgroundImage: './img/maps/oldManHomeBackground.png',
        foregroundImage: './img/maps/oldManHomeForeground.png',
        mapData: oldManHomeMapData,
        transition2Map: {
            1: ['home', true, 'down', 0, 6],
            2: ['', false, '', 0, 0]
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
            1: ['home', true, 'left', 6, 0]
        }
    }
}