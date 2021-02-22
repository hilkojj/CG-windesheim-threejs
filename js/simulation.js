function init() {
    const clock = new THREE.Clock();

    const scene = new THREE.Scene();
    const fov = 75;
    const aspect = 1;  // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 5, -10);
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMapEnabled = true;
    document.body.appendChild(renderer.domElement);
    const controls = new THREE.OrbitControls ( camera, renderer.domElement );
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
    scene.add(cube);

    function loadModels(file) {
        const loader = new THREE.GLTFLoader();
        loader.load(file, function (gltf) {
    
            scene.add(gltf.scene);
    
        }, undefined, function (error) {
    
            console.error(error);
            alert("Error while loading model(s)!\nCheck console.");
        });
    }

    loadModels("models/zamek.glb")
    loadModels("models/martini_toren.glb")


    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.);
    directionalLight.position.set(5, 10, 10);
    scene.add(directionalLight);

    const light = new THREE.HemisphereLight(0xADDEFF, 0xffffff, 1.);
    scene.add(light);

    function render() {
        requestAnimationFrame(render);
        //controls.update();
        renderer.render(scene, camera);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }
    render();
}

window.onload = init;