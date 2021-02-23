var m = 7;

function init() {
    console.log(m);
    const clock = new THREE.Clock();

    const scene = new THREE.Scene();
    const fov = 75;
    const aspect = 1;  // the canvas default
    const near = 1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 5, -10);
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    const renderer = new THREE.WebGLRenderer();
    document.body.appendChild(renderer.domElement);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();


    // this function resizes the camera & canvas so it fits the window:
    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize, false);   // call onWindowResize() every time the window resizes.
    onWindowResize();                                           // call onWindowResize() once

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = 1;
    //scene.add(cube);

    const car = new Car ( scene, 0, 0 );

    function loadModel(file, x, y, z) {
        const loader = new THREE.GLTFLoader();
        loader.load(file, function (gltf) {

            const model = gltf.scene.children[0];
            model.position.x = x;
            model.position.y = y;
            model.position.z = z;

            scene.add(model);

        }, undefined, function (error) {

            console.error(error);
            alert("Error while loading model(s)!\nCheck console.");
        });
    }

    loadModel("models/zamek.glb", 10, -1, 0)          // a castle in Poland
    loadModel("models/martini_toren.glb", 0, -1, 10)  // a tower in Groningen


    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.);
    directionalLight.position.set(5, 10, 10);
    scene.add(directionalLight);

    const light = new THREE.HemisphereLight(0xADDEFF, 0xffffff, 1.);
    scene.add(light);

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
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(500, 500);

        var mat = new THREE.MeshBasicMaterial({ map: groundTexture });
        var plane = new THREE.Mesh(geo, mat);
        plane.rotateX(- Math.PI / 2); // rotate it
        plane.position.y -= 1.;

        scene.add(plane);
    }

    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        car.update();
    }
    render();
}

window.onload = init;