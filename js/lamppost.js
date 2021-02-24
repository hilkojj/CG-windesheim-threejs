
function addLampPost(scene, x, y, z) {

    const HEIGHT = 3.5;
    var material = new THREE.MeshPhongMaterial({ color: 0x949494 });

    // cylinder:
    {
        var geometry = new THREE.CylinderGeometry(.1, .1, HEIGHT, 8);
        var cylinder = new THREE.Mesh(geometry, material);
    
        cylinder.position.x = x;
        cylinder.position.y = y + HEIGHT * .5;
        cylinder.position.z = z;

        scene.add(cylinder);
    }
    // box:
    {
        var geometry = new THREE.BoxGeometry(.3, .1, 1);
        var box = new THREE.Mesh(geometry, material);
    
        box.position.x = x;
        box.position.y = y + HEIGHT;
        box.position.z = z - .4;

        scene.add(box);
    }
    // sphere:
    {
        var geometry = new THREE.SphereGeometry(.1, 8, 8);
        var lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffea82 });
        var sphere = new THREE.Mesh(geometry, lightMaterial);
    
        sphere.position.x = x;
        sphere.position.y = y + HEIGHT - .1;
        sphere.position.z = z - .75;

        scene.add(sphere);
    }
}
