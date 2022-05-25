export default [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path: [
            '/static/textures/environmentMap/px.jpg',
            '/static/textures/environmentMap/nx.jpg',
            '/static/textures/environmentMap/py.jpg',
            '/static/textures/environmentMap/ny.jpg',
            '/static/textures/environmentMap/pz.jpg',
            '/static/textures/environmentMap/nz.jpg',
        ],
    },
    {
        name: 'grassColorTexture',
        type: 'texture',
        path: '/static/textures/sea.png',
    },
    // {
    //     name: 'grassColorTexture',
    //     type: 'texture',
    //     path: '/static/textures/dirt/color.jpg',
    // },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: '/static/textures/dirt/normal.jpg',
    },
    {
        name: 'casaModel',
        type: 'gltfModel',
        path: '/static/models/casa.gltf',
    },
    {
        name: 'testModel',
        type: 'gltfModel',
        path: '/static/models/test.glb',
    },
    // {
    //     name: 'casaModel',
    //     type: 'fbxModel',
    //     path: '/static/models/casa.fbx',
    // },
];
