function init() {

    const FLOOR_HEIGHT = -1; // height of the floor, models should be placed at this height too.

    const scene = new THREE.Scene();
    const fov = 75;
    const aspect = 1;  // the canvas default
    const near = .1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 5, -10);
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    // initialize renderer:
    const renderer = new THREE.WebGLRenderer();
    document.body.appendChild(renderer.domElement);

    // initialize camera controls (WASD+QE+Mouse):
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();


    // this function resizes the camera & canvas so it fits the window:
    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // update camera/canvas size:
    window.addEventListener('resize', onWindowResize, false);   // call onWindowResize() every time the window resizes.
    onWindowResize();                                           // call onWindowResize() once

    // initiating a few cars:
    const cars = [
        new Car(scene, 0, 0, -20, 0, -20, 0, 30),
        new Car(scene, 0, 0, -20, 0, -20, 0, 40),
        new Car(scene, 0, 0, -20, 0, -20, 0, 60),
        new Car(scene, 0, 0, -20, 0, -20, 0, 55),
        new Car(scene, 0, 0, -20, 0, -20, 0, 300)
    ];

    // Adding a few lampposts:
    {
        for (let i = 0; i < 8; i++)
            addLampPost(scene, 8 + i * -5., FLOOR_HEIGHT, 16.5);
    }

    // Adding some buildings:
    windows = new WindowList();
    {
        addHouse(scene, windows, -20, -22.5, 20);
        addHouse(scene, windows, -15, -22.5, 7);
        addHouse(scene, windows, -10, -22.5, 10);
        addHouse(scene, windows, -3, -22.5, 4);
        addHouse(scene, windows, 20, -22.5, 15);
        addHouse(scene, windows, -22.5, -5, 10);
        addHouse(scene, windows, -24, 0, 10);
        addHouse(scene, windows, -20, 22.5, 4);
        addHouse(scene, windows, -15, 22.5, 5);
        addHouse(scene, windows,  2.5, 20, 4);
        addHouse(scene, windows, -4, 27.5, 4);
        addHouse(scene, windows, -9, 27.5, 3);
    }

    // function to load a GLFT model, and to place it at (x, y, z)
    function loadModel(file, x, y, z) {
        const loader = new THREE.GLTFLoader();
        loader.load(file, function (gltf) {

            const model = gltf.scene.children[0];   // only pick the first model.
            model.position.x = x;
            model.position.y = y;
            model.position.z = z;

            scene.add(model);

        }, undefined, function (error) {

            console.error(error);
            alert("Error while loading model(s)!\nCheck console.");
        });
    }

    loadModel("models/zamek.glb", -10, FLOOR_HEIGHT, -0);           // a castle in Poland
    loadModel("models/martini_toren.glb", -5, FLOOR_HEIGHT, 20);    // a tower in Groningen
    loadModel("models/road.glb", 0, FLOOR_HEIGHT + .01, 0);         // the road

    // Adding sun & hemisphere light:
    {
        // sun:
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.);
        directionalLight.position.set(5, 10, 10);
        scene.add(directionalLight);

        // hemisphere:
        const light = new THREE.HemisphereLight(0xADDEFF, 0xffffff, 1.);
        scene.add(light);
    }
    // Adding Skybox:
    {
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            './models/textures/skyboxsun45deg/skyrender0001.png',   // pos-x
            './models/textures/skyboxsun45deg/skyrender0004.png',   // neg-x
            './models/textures/skyboxsun45deg/skyrender0003.png',   // pos-y
            './models/textures/skyboxsun45deg/skyrender0006.png',   // neg-y
            './models/textures/skyboxsun45deg/skyrender0005.png',   // pos-z
            './models/textures/skyboxsun45deg/skyrender0002.png'    // neg-z
        ]);
        scene.background = texture;
    }
    // Adding fog:
    {
        const color = 0x797574;
        const near = 1;
        const far = 100;
        scene.fog = new THREE.Fog(color, near, far);
    }
    // Adding ground plane:
    {
        var geo = new THREE.PlaneBufferGeometry(1000, 1000);

        var groundTexture = new THREE.TextureLoader().load('models/textures/grass.jpg');
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;   // repeat grass texture.
        groundTexture.repeat.set(500, 500);

        var mat = new THREE.MeshBasicMaterial({ map: groundTexture });
        var plane = new THREE.Mesh(geo, mat);
        plane.rotateX(- Math.PI / 2); // rotate it
        plane.position.y = FLOOR_HEIGHT;
        plane.receiveShadow = true;

        scene.add(plane);
    }

    // render function for updating the scene and to render it.
    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);

        cars.forEach(c => c.update());
        windows.update();
    }
    render();
}

window.onload = init;
