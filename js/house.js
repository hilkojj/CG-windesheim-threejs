//this function adds a house of a given height (h) at coordinates (x, z)
//windows parameter refers to a windowList instance, which will be responsible for turning the light on and off
function addHouse(scene, windows, x, z, h) {

    const WIDTH = 5; //width and depth of all generated buildings

    // cone - roof:
    {
        const ROOF_HEIGHT = 3;
        var geometry = new THREE.ConeGeometry(WIDTH / Math.sqrt(2), ROOF_HEIGHT, 4);
        geometry.rotateY(Math.PI / 4);
        var material = new THREE.MeshLambertMaterial({ color: 0xAE1A11 });
        var roof = new THREE.Mesh(geometry, material);
    
        roof.position.x = x;
        roof.position.y = -1 + h + ROOF_HEIGHT / 2;
        roof.position.z = z;

        scene.add(roof);
    }
    // box:
    {
        var geometry = new THREE.BoxGeometry(WIDTH, h, WIDTH);
        var material = new THREE.MeshLambertMaterial({ color: 0x6D2B1A });
        var front = new THREE.Mesh(geometry, material);
    
        front.position.x = x;
        front.position.y = -1 + h / 2;
        front.position.z = z;

        scene.add(front);
    }
    // square - window:
    {
        const WINDOW_HEIGHT = 1.5;
        const WINDOW_WIDTH  = 1;
        var geometry = new THREE.PlaneGeometry(WINDOW_WIDTH, WINDOW_HEIGHT);
        var glassMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x01001B,
            side: THREE.DoubleSide,
            shininess:  10,
            specular: 0xFEFBAA,
            emissive: 0x000000
        });

        const WINDOW_BUFFER = 1.25;
        for (var i = h - WINDOW_BUFFER - WINDOW_HEIGHT; 
            i >= WINDOW_BUFFER - 0.5; 
            i -= (WINDOW_HEIGHT + WINDOW_BUFFER)) {

            var front = new THREE.Mesh(geometry, glassMaterial.clone());
            var back  = new THREE.Mesh(geometry, glassMaterial.clone());
            
            var side = new THREE.Mesh(geometry, glassMaterial.clone());
            var last = new THREE.Mesh(geometry, glassMaterial.clone());

            front.position.x = x;
            front.position.y = i;
            front.position.z = z + WIDTH / 2 + 0.01;

            back.position.x = x;
            back.position.y = i;
            back.position.z = z - WIDTH / 2 - 0.01;

            side.rotateY(Math.PI / 2);
            side.position.x = x + WIDTH / 2 + 0.01;
            side.position.y = i;
            side.position.z = z;

            last.rotateY(Math.PI / 2);
            last.position.x = x - WIDTH / 2 - 0.01;
            last.position.y = i;
            last.position.z = z;

            scene.add(front);
            scene.add(back);
            scene.add(side);
            scene.add(last);

            windows.add(front);
            windows.add(back);
            windows.add(side);
            windows.add(last);
        }
    }
}

class WindowList {
    windows = new Array();

    add = function(window) {
        this.windows.push(window);
    }

    counter = 0;
    update = function() {
        const PERIOD = 6000; //determines how much frames pass between subsequent window updates
        const PROBABILITY = 0.0025; //determines the probability of a light being turned on in any given window

        const reverseProbability = 1 - PROBABILITY * 2;
        this.counter++;

        if(this.counter = PERIOD) {
            this.windows.forEach(window => {
                const rand = Math.random();
                if (rand < PROBABILITY) {
                    window.material.emissive.set(0xFFE113);
                } else if (rand > reverseProbability) {
                    window.material.emissive.set(0x000000);
                }
                this.counter = 0;
            });
        }
    }
}
